import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  notificationService,
  destinationService,
  parseNotificationsList,
  countUnreadNotifications,
  syncNotificationBadge,
} from '../../../src/services/api'
import { filterSearchPages, normalizeDestinationList } from './dashboardSearchItems'

export default function TopBar({ onOpenSidebar }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const searchWrapRef = useRef(null)
  const searchInputRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [destResults, setDestResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const searchDebounceRef = useRef(null)
  const [notifCount, setNotifCount] = useState(() => {
    try {
      const n = Number(localStorage.getItem('notificationsCount') || '0')
      return Number.isFinite(n) ? n : 0
    } catch { return 0 }
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchUnreadCount = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (cancelled) return;
        const list = parseNotificationsList(res);
        const unread = countUnreadNotifications(list);
        setNotifCount(unread);
        syncNotificationBadge(unread);
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch unread count:', err);
      }
    };

    fetchUnreadCount();
    const pollMs = 12000;
    const intervalId = setInterval(fetchUnreadCount, pollMs);
    const onFocus = () => fetchUnreadCount();
    window.addEventListener('focus', onFocus);

    const handler = (e) => {
      const n = typeof e.detail === 'number' ? e.detail : 0;
      setNotifCount(n);
    };
    window.addEventListener('notifications:update', handler);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('notifications:update', handler);
    };
  }, []);

  const navigate = useNavigate()

  const pageResults = useMemo(() => filterSearchPages(searchQuery), [searchQuery])

  const flatResults = useMemo(() => {
    const pages = pageResults.map((p) => ({ kind: 'page', ...p }))
    const dests = destResults.map((d) => ({
      kind: 'destination',
      id: d.id,
      label: d.name,
      sub: d.type || 'Destination',
      icon: '📍',
      path: d.id ? `/destination/${d.id}` : '/destination',
    }))
    return [...pages, ...dests]
  }, [pageResults, destResults])

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    const q = searchQuery.trim()
    if (!q) {
      setDestResults([])
      setSearchLoading(false)
      return undefined
    }
    setSearchLoading(true)
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const raw = await destinationService.getDestinationSuggestions(q, 6)
        setDestResults(normalizeDestinationList(raw))
      } catch {
        setDestResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 280)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false)
        setHighlightIdx(-1)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        searchInputRef.current?.focus()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const goToResult = useCallback(
    (item) => {
      if (!item) return
      setSearchOpen(false)
      setSearchQuery('')
      setHighlightIdx(-1)
      if (item.kind === 'destination' && item.id) {
        navigate(`/destination/${item.id}`)
      } else if (item.kind === 'page') {
        navigate(item.path)
      } else if (item.path) {
        navigate(item.path)
      }
    },
    [navigate]
  )

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.()
    if (highlightIdx >= 0 && flatResults[highlightIdx]) {
      goToResult(flatResults[highlightIdx])
      return
    }
    const q = searchQuery.trim()
    if (!q) return
    if (flatResults.length > 0) {
      goToResult(flatResults[0])
      return
    }
    setSearchOpen(false)
    navigate('/destination', { state: { initialSearch: q } })
    setSearchQuery('')
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSearchOpen(true)
      setHighlightIdx((i) => Math.min(i + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
      setHighlightIdx(-1)
      searchInputRef.current?.blur()
    } else if (e.key === 'Enter') {
      handleSearchSubmit(e)
    }
  }

  const userName = localStorage.getItem('userName') || 'Traveler';
  const userInitial = userName.charAt(0).toUpperCase();

  const searchDropdown = searchOpen && (flatResults.length > 0 || searchLoading || searchQuery.trim()) && (
    <div
      className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[200] max-h-80 overflow-y-auto"
      role="listbox"
    >
      {searchLoading && (
        <p className="px-4 py-3 text-xs font-bold text-gray-400">Searching destinations…</p>
      )}
      {flatResults.length === 0 && !searchLoading && searchQuery.trim() && (
        <p className="px-4 py-3 text-sm text-gray-500">No results. Press Enter to search destinations.</p>
      )}
      {pageResults.length > 0 && (
        <p className="px-4 pt-3 pb-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest">Pages</p>
      )}
      {flatResults.map((item, idx) => (
        <button
          key={`${item.kind}-${item.path || item.id}-${idx}`}
          type="button"
          role="option"
          aria-selected={highlightIdx === idx}
          onMouseEnter={() => setHighlightIdx(idx)}
          onClick={() => goToResult(item)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
            highlightIdx === idx ? 'bg-indigo-50' : 'hover:bg-gray-50'
          }`}
        >
          <span className="text-lg w-8 text-center shrink-0">{item.icon || '📍'}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-gray-900 truncate">{item.label}</span>
            {item.sub && (
              <span className="block text-xs text-gray-500 font-medium truncate">{item.sub}</span>
            )}
          </span>
          <span className="text-[10px] font-black text-gray-300 uppercase shrink-0">
            {item.kind === 'page' ? 'Go' : 'Place'}
          </span>
        </button>
      ))}
    </div>
  )

  const searchField = (
    <form onSubmit={handleSearchSubmit} className="relative w-full group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <input
        ref={searchInputRef}
        type="search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          setSearchOpen(true)
          setHighlightIdx(-1)
        }}
        onFocus={() => setSearchOpen(true)}
        onKeyDown={handleSearchKeyDown}
        placeholder="Search pages, destinations… (Alt + S)"
        autoComplete="off"
        aria-label="Search dashboard"
        aria-expanded={searchOpen}
        aria-controls="dashboard-search-results"
        className="w-full h-12 pl-12 pr-12 rounded-2xl bg-gray-50 border border-transparent text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all duration-300 shadow-inner group-hover:bg-gray-100/50"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery('')
            setDestResults([])
            setHighlightIdx(-1)
            searchInputRef.current?.focus()
          }}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
        <kbd className="h-5 px-1.5 inline-flex items-center justify-center rounded border border-gray-200 bg-white font-mono text-[10px] font-bold text-gray-400">Alt</kbd>
        <kbd className="h-5 w-5 inline-flex items-center justify-center rounded border border-gray-200 bg-white font-mono text-[10px] font-bold text-gray-400">S</kbd>
      </div>
      <div id="dashboard-search-results">{searchDropdown}</div>
    </form>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-gray-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Section: Branding & Identity */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onOpenSidebar && onOpenSidebar()}
            className="md:hidden p-3 rounded-2xl bg-white border border-gray-100 text-gray-900 shadow-sm hover:shadow-md transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-200/50 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                {userInitial}
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-gray-900 font-black text-base md:text-lg tracking-tight leading-none mb-1">
                {userName}
              </h1>
              <div className="flex items-center gap-1.5 font-bold text-[10px] text-indigo-500 uppercase tracking-widest opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Pro Explorer
              </div>
            </div>
          </div>
        </div>

        {/* Center: quick search */}
        <div className="flex flex-1 max-w-xl min-w-0" ref={searchWrapRef}>
          {searchField}
        </div>

        {/* Right Section: Interactive Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications With Animation */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-3 rounded-2xl text-gray-500 bg-transparent hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:rotate-12 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {notifCount > 0 ? (
              <span className="absolute top-2.5 right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-4 ring-white shadow-lg animate-bounce">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            ) : (
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-indigo-400 ring-2 ring-white"></span>
            )}
          </button>

          {/* Sizable Profile Portal */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(o => !o)}
              className={`flex items-center gap-3 p-1 pl-1.5 pr-4 rounded-full border-2 transition-all duration-300 active:scale-95 ${open ? 'border-indigo-100 bg-white shadow-md' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center font-black text-sm text-indigo-600 overflow-hidden">
                {userInitial}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-gray-400 transition-transform duration-500 ${open ? 'rotate-180 text-indigo-500' : ''}`}>
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-100/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-6 py-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Explorer Account</p>
                  <p className="text-base font-black text-gray-900 truncate tracking-tight">{userName}</p>
                </div>
                <div className="p-3 grid gap-1">
                  <button className="flex items-center gap-4 w-full text-left px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200" onClick={() => { setOpen(false); navigate('/settings'); }}>
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                    Account Profile
                  </button>
                  <button className="flex items-center gap-4 w-full text-left px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200" onClick={() => { setOpen(false); navigate('/settings'); }}>
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.004.827c.422.348.53.954.26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.127.332-.184.582-.496.645-.869L9.594 3.94ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
                      </svg>
                    </div>
                    System Settings
                  </button>
                  <div className="h-px bg-gray-100 my-2 mx-4" />
                  <button
                    className="flex items-center gap-4 w-full text-left px-4 py-3 text-sm font-black text-rose-500 rounded-2xl hover:bg-rose-50 transition-all duration-200"
                    onClick={() => {
                      setOpen(false);
                      localStorage.clear();
                      navigate('/login');
                    }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                    </div>
                    Secure Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
