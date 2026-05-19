import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const REFRESH_INTERVAL = 60 // seconds

const PAKISTAN_CITIES = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Peshawar',
    'Quetta', 'Multan', 'Faisalabad', 'Sialkot', 'Hyderabad',
    'Gujranwala', 'Sargodha', 'Bahawalpur', 'Sukkur', 'Abbottabad',
    'Nankana', 'Murree', 'Mardan', 'Mingora',
]

/* ─── Brand config (per company) ─────────────────────────────────────────── */
const BRAND = {
    DX: { grad: 'from-emerald-500 to-teal-600', btn: '#059669', hover: '#047857', light: '#ecfdf5', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    FM: { grad: 'from-blue-500 to-indigo-600', btn: '#2563eb', hover: '#1d4ed8', light: '#eff6ff', badge: 'bg-blue-50 text-blue-700 border border-blue-100' },
    SW: { grad: 'from-orange-500 to-amber-500', btn: '#ea580c', hover: '#c2410c', light: '#fff7ed', badge: 'bg-orange-50 text-orange-700 border border-orange-100' },
    BT: { grad: 'from-purple-500 to-violet-600', btn: '#7c3aed', hover: '#6d28d9', light: '#f5f3ff', badge: 'bg-purple-50 text-purple-700 border border-purple-100' },
    PR: { grad: 'from-rose-500 to-red-600', btn: '#dc2626', hover: '#b91c1c', light: '#fff1f2', badge: 'bg-rose-50 text-rose-700 border border-rose-100' },
    CR: { grad: 'from-green-500 to-teal-500', btn: '#16a34a', hover: '#15803d', light: '#f0fdf4', badge: 'bg-green-50 text-green-700 border border-green-100' },
    ID: { grad: 'from-orange-600 to-red-500', btn: '#ea580c', hover: '#c2410c', light: '#fff7ed', badge: 'bg-orange-50 text-orange-700 border border-orange-100' },
    MC: { grad: 'from-yellow-500 to-amber-600', btn: '#ca8a04', hover: '#a16207', light: '#fefce8', badge: 'bg-yellow-50 text-yellow-700 border border-yellow-100' },
}
const DEFAULT_BRAND = { grad: 'from-gray-500 to-gray-600', btn: '#4b5563', hover: '#374151', light: '#f9fafb', badge: 'bg-gray-50 text-gray-600 border border-gray-100' }

/* ─── Type helpers ────────────────────────────────────────────────────────── */
function typeIcon(type) { return type === 'train' ? '🚂' : type === 'car' ? '🚗' : '🚌' }
function typeLabel(type) { return type === 'train' ? 'Train' : type === 'car' ? 'Car Service' : 'Bus' }
function bookLabel(type) { return type === 'car' ? 'Book Ride 🚗' : type === 'train' ? 'Book Ticket 🎫' : 'Book Seat 🎟️' }

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
function RouteSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row gap-6">
            <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="flex gap-3">
                    <div className="h-3 bg-slate-100 rounded w-20" />
                    <div className="h-3 bg-slate-100 rounded w-20" />
                    <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
            </div>
            <div className="flex flex-col gap-3 items-end shrink-0 min-w-[160px]">
                <div className="h-7 bg-slate-200 rounded w-28" />
                <div className="h-11 bg-slate-200 rounded-xl w-40" />
            </div>
        </div>
    )
}

/* ─── Custom City Dropdown ──────────────────────────────────────────────────── */
function CityDropdown({ label, value, onChange, placeholder, icon }) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filtered = PAKISTAN_CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="relative flex-1" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex flex-col gap-1 px-4 py-3 bg-slate-50 rounded-xl border transition-all cursor-pointer group ${isOpen ? 'border-indigo-400 bg-white ring-2 ring-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
            >
                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none">{icon} {label}</label>
                <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-bold ${value ? 'text-slate-800' : 'text-slate-400'}`}>
                        {value || placeholder}
                    </span>
                    <span className={`text-[10px] text-slate-400 group-hover:text-indigo-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}>▼</span>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] overflow-hidden"
                    >
                        <div className="p-2 border-b border-slate-50">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:border-indigo-300"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                            <button
                                onClick={() => { onChange(''); setIsOpen(false); setSearch('') }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${!value ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Any City
                            </button>
                            {filtered.map(city => (
                                <button
                                    key={city}
                                    onClick={() => { onChange(city); setIsOpen(false); setSearch('') }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${value === city ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function TransportSearchPage() {
    const { companyCode } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const code = companyCode?.toUpperCase()
    const brand = BRAND[code] || DEFAULT_BRAND

    const [company, setCompany] = useState(location.state?.company || null)
    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState(null)
    const [lastRefreshed, setLastRefreshed] = useState(null)
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
    const intervalRef = useRef(null)
    const countdownRef = useRef(null)

    const today = new Date().toISOString().split('T')[0]
    const [form, setForm] = useState({ from: '', to: '', date: today, passengers: 1 })

    /* Fetch company if not in nav state */
    useEffect(() => {
        if (!company) {
            fetch(`${API_BASE}/api/transport/companies`)
                .then(r => r.json())
                .then(json => {
                    if (json.success) {
                        const found = json.data.find(c => c.code === code)
                        if (found) setCompany(found)
                        else navigate('/transport', { replace: true })
                    }
                })
                .catch(() => navigate('/transport', { replace: true }))
        }
    }, [code, company, navigate])

    const doSearch = useCallback(async (params, silent = false) => {
        if (!silent) { setLoading(true); setSearched(true) }
        setError(null)
        try {
            const q = new URLSearchParams({
                companyCode: code,
                from: params.from || '',
                to: params.to || '',
                date: params.date || today,
                passengers: params.passengers || 1,
            })
            const res = await fetch(`${API_BASE}/api/transport/search?${q}`)
            const json = await res.json()
            if (json.success) {
                setRoutes(json.data)
                setSearched(true)
                setLastRefreshed(new Date())
                setCountdown(REFRESH_INTERVAL)
            } else {
                setError(json.message || 'Search failed.');
                setRoutes([])
            }
        } catch {
            setError('Network error — please ensure the backend is running.')
            setRoutes([])
        } finally {
            setLoading(false)
        }
    }, [code, today])

    /* Auto-load routes on mount */
    useEffect(() => {
        if (company) doSearch(form, false)
    }, [company, doSearch])

    /* Auto-refresh every 60 seconds */
    useEffect(() => {
        if (!company) return
        intervalRef.current = setInterval(() => {
            doSearch(form, true) // silent background refresh
        }, REFRESH_INTERVAL * 1000)
        return () => clearInterval(intervalRef.current)
    }, [company, doSearch, form])

    /* Countdown ticker */
    useEffect(() => {
        countdownRef.current = setInterval(() => {
            setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1))
        }, 1000)
        return () => clearInterval(countdownRef.current)
    }, [])

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    const handleCityChange = (name, value) => setForm(p => ({ ...p, [name]: value }))
    const handleSubmit = e => { e.preventDefault(); doSearch(form) }
    const handleBook = route => window.open(`${API_BASE}${route.redirect_url}`, '_blank')

    const companyType = company?.type || 'bus'

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* ════ HEADER ═══════════════════════════════════════════════════ */}
            <header className="bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/transport')}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors group"
                        >
                            <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors text-base">←</span>
                            All
                        </button>
                        <div className="h-6 w-px bg-slate-200" />
                        {company ? (
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${brand.grad} flex items-center justify-center text-xl shadow-sm`}>
                                    {company.logo}
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-base font-black text-slate-900 leading-none">{company.name}</h1>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${brand.badge}`}>
                                        {typeIcon(companyType)} {typeLabel(companyType)}
                                    </span>
                                </div>
                            </div>
                        ) : <div className="animate-pulse w-32 h-6 bg-slate-100 rounded" />}
                    </div>
                </div>
            </header>

            {/* ════ HERO (Simplified) ═════════════════════════════════════════════════════ */}
            {company && (
                <div className="bg-white border-b border-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight mb-2">
                                {company.name}
                            </h2>
                            <div className={`h-1.5 w-20 mx-auto rounded-full bg-gradient-to-r ${brand.grad}`}></div>
                        </motion.div>
                    </div>
                </div>
            )}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 🔎 SEARCH FORM */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-10 relative z-30"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <CityDropdown label="From City" icon="🛫" value={form.from} placeholder="City/Origin" onChange={(v) => handleCityChange('from', v)} />
                        <CityDropdown label="To City" icon="🛬" value={form.to} placeholder="City/Destination" onChange={(v) => handleCityChange('to', v)} />
                        <div className="flex flex-col gap-1 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-300 transition-all h-full">
                            <label className="text-[10px] font-black text-indigo-500 tracking-widest uppercase">📅 Date</label>
                            <input type="date" name="date" min={today} value={form.date} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 outline-none w-full text-sm cursor-pointer" />
                        </div>
                        <div className="flex flex-col gap-1 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-300 transition-all h-full">
                            <label className="text-[10px] font-black text-indigo-500 tracking-widest uppercase">👥 Seats</label>
                            <select name="passengers" value={form.passengers} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 outline-none w-full text-sm cursor-pointer">
                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all disabled:opacity-50">
                        {loading ? 'Searching...' : '🔍 Search Availability'}
                    </button>
                </motion.form>

                {/* 📑 RESULTS */}
                <AnimatePresence mode="wait">
                    {loading && <div className="space-y-4">{[1, 2, 3].map(i => <RouteSkeleton key={i} />)}</div>}

                    {!loading && error && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                            <p className="text-slate-600 font-medium text-sm">{error}</p>
                            <button onClick={() => doSearch(form)} className="mt-5 px-7 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm">Retry</button>
                        </div>
                    )}

                    {!loading && !error && routes.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {routes.map((r, i) => (
                                <RouteCard key={r.id} route={r} brand={brand} companyType={companyType}
                                    onBook={() => window.open(`${API_BASE}${r.redirect_url}`, '_blank')} />
                            ))}
                        </motion.div>
                    )}

                    {!loading && !error && searched && routes.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-800 mb-2">No Routes Found</h3>
                            <p className="text-slate-500 text-sm">We couldn't find matching routes for this connection.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function RouteCard({ route, brand, companyType, onBook }) {
    const isCritical = route.seats_available <= 5;
    const isLow = route.seats_available <= 15;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${brand.grad}`} />
            <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${brand.grad} flex items-center justify-center text-4xl shadow-lg shrink-0`}>
                    {route.company_logo}
                </div>

                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{route.company_name}</span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${brand.badge}`}>{route.seat_type}</span>
                        {/* 💺 Seats Indicator */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isCritical ? 'bg-rose-50 border-rose-100 text-rose-600' :
                            isLow ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                'bg-slate-50 border-slate-100 text-slate-600'
                            }`}>
                            <span className="text-[10px] font-bold">
                                {isCritical ? '🚨 Only ' : '💺 '}
                                {route.seats_available} Seats Left
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-center md:text-left">
                        <div>
                            <p className="text-3xl font-black text-slate-900 leading-none">{route.departure_time}</p>
                            <p className="text-xs font-bold text-slate-400 mt-2 uppercase">{route.from_city}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-slate-300 uppercase italic">{route.duration}</span>
                            <div className="w-full h-px bg-slate-100 relative">
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl bg-white px-2 text-slate-200">{typeIcon(companyType)}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900 leading-none">{route.arrival_time}</p>
                            <p className="text-xs font-bold text-slate-400 mt-2 uppercase">{route.to_city}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:border-l border-slate-100 lg:pl-8 flex flex-col items-center lg:items-end gap-3 min-w-[200px] w-full lg:w-auto">
                    <div className="text-center lg:text-right">
                        <div className="flex items-center lg:justify-end gap-1.5 mb-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Fare</p>
                        </div>
                        <div className="flex items-baseline gap-1 justify-center lg:justify-end">
                            <span className="text-xs font-black text-slate-400">PKR</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                {(route.display_price || route.price).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <button onClick={onBook} style={{ backgroundColor: brand.btn }}
                        className="w-full py-4 px-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                        {bookLabel(companyType)} →
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
