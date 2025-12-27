import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ onOpenSidebar }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null);
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
    const handler = (e) => {
      const n = typeof e.detail === 'number' ? e.detail : 0
      setNotifCount(n)
    }
    window.addEventListener('notifications:update', handler)
    return () => window.removeEventListener('notifications:update', handler)
  }, [])
  const navigate = useNavigate()

  const userName = localStorage.getItem('userName') || 'Traveler';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="min-h-16 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 gap-y-2 px-4 py-2 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => onOpenSidebar && onOpenSidebar()}
            className="md:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-md grid place-items-center text-white font-semibold">
            {userInitial}
          </div>
          <div className="truncate">
            <div className="hidden sm:block text-base md:text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Welcome, {userName} 👋
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">Explore and Plan</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none">
          <div className="relative w-full sm:flex-1 sm:max-w-[16rem] md:max-w-[20rem] lg:max-w-[28rem] order-2 sm:order-none">
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="w-full pl-10 pr-3 py-2 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 focus:border-indigo-500 outline-none text-sm text-gray-800 placeholder:text-gray-400 shadow-inner focus:shadow-sm transition"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
              <path d="M20 20l-2-2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <button
            aria-label="Notifications"
            title="Open notifications"
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-300 shrink-0 order-1 sm:order-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 10-12 0v.75a8.967 8.967 0 01-2.311 6.022c1.78.68 3.6 1.085 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {notifCount > 0 ? (
              <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <div className="relative shrink-0 order-3 sm:order-none" ref={dropdownRef}>
            <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center text-sm font-semibold shadow">
                {userInitial}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => { setOpen(false); navigate('/settings'); }}>Profile</button>
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => { setOpen(false); navigate('/settings'); }}>Settings</button>
                <div className="h-px bg-gray-100" />
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setOpen(false);
                    localStorage.clear();
                    navigate('/login');
                  }}
                >Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
