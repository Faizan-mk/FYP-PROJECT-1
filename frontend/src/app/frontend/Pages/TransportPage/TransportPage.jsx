import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BackToDashboardButton from '../../components/BackToDashboardButton'
import { useVoiceSearch } from '../../hooks/useVoiceSearch'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const REFRESH_INTERVAL = 60 // seconds

/* ─── Company brand config ──────────────────────────────────────────────────── */
const BRAND = {
    DX: { color: '#059669', bg: '#ecfdf5', badge: 'Premium Bus', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000' },
    FM: { color: '#2563eb', bg: '#eff6ff', badge: 'Luxury Travel', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1000' },
    SW: { color: '#ea580c', bg: '#fff7ed', badge: 'Safe Journey', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfA3_HhaMSqCx3kyuN6TRrE2RLQiRwnV9XMQ&s' },
    BT: { color: '#7c3aed', bg: '#f5f3ff', badge: 'Quick Routes', image: 'https://pakistantourntravel.com/wp-content/uploads/2023/12/bilal-travels.jpg' },
    PR: { color: '#dc2626', bg: '#fff1f2', badge: 'National Rail', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXZ0__padZvUeZtsCipiy1_DZnntsrfTjgbg&s' },
    CR: { color: '#1da462', bg: '#f0fdf4', badge: 'City Ride', image: 'https://cdn.gccbusinessnews.com/wp-content/uploads/2021/07/05104512/GBN_Careem_19072021.jpg' },
    ID: { color: '#ff5500', bg: '#fff7f0', badge: 'Set Fare', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000' },
    MC: { color: '#ca8a04', bg: '#fefce8', badge: 'Reliable Cab', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKfEv3_16K_HTnkoO8XMPkjlwuwIbH7d81Jw&s' },
}
const DEFAULT_BRAND = { color: '#4b5563', bg: '#f9fafb', badge: 'Operator', image: 'https://images.unsplash.com/photo-1464851707681-f9d5fdaccea8?auto=format&fit=crop&q=80&w=800' }

/* ─── Category config ───────────────────────────────────────────────────────── */
const CATEGORIES = [
    { key: 'all', label: 'All', icon: '🗺️', desc: 'All transport options' },
    { key: 'bus', label: 'Bus', icon: '🚌', desc: 'Intercity buses' },
    { key: 'train', label: 'Train', icon: '🚂', desc: 'Pakistan Railways' },
    { key: 'car', label: 'Car', icon: '🚗', desc: 'Cab & ride-hailing' },
]

const TYPE_ICON = { bus: '🚌', train: '🚂', car: '🚗' }

/* ─── Skeleton ──────────────────────────────────────────────────────────────── */
function Skeleton() {
    return (
        <div className="animate-pulse w-[300px] h-[300px] bg-slate-200 rounded-[3rem]" />
    )
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export default function TransportPage() {
    const navigate = useNavigate()
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')
    const [loaded, setLoaded] = useState(false)
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
    const intervalRef = useRef(null)
    const countdownRef = useRef(null)

    // Voice & Search states
    const [searchQuery, setSearchQuery] = useState('')
    const searchInputRef = useRef(null)
    const {
        isListening,
        voiceText,
        voiceSupported,
        inputValue,
        cancelListening,
        confirmVoice,
        toggleListening,
    } = useVoiceSearch({ searchQuery, setSearchQuery, focusRef: searchInputRef })

    const fetchCompanies = useCallback(async (isManual = false) => {
        if (isManual) setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/transport/companies`)
            const json = await res.json()
            if (json.success) {
                setCompanies(json.data)
                setLoaded(true)
            } else {
                setError('Failed to load transport companies.')
            }
        } catch {
            setError('Network error — please check backend.')
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial load
    useEffect(() => { fetchCompanies(true) }, [fetchCompanies])

    // Auto-refresh every 60 seconds
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchCompanies(false)
        }, REFRESH_INTERVAL * 1000)
        return () => clearInterval(intervalRef.current)
    }, [fetchCompanies])

    // Countdown ticker
    useEffect(() => {
        countdownRef.current = setInterval(() => {
            setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1))
        }, 1000)
        return () => clearInterval(countdownRef.current)
    }, [])

    const filtered = companies.filter(c => {
        const matchCat = filter === 'all' || c.type === filter
        const q = searchQuery.toLowerCase()
        const matchSearch = !q || c.name.toLowerCase().includes(q)
        return matchCat && matchSearch
    })

    return (
        <div className="min-h-screen bg-[#fafafa]">

            {/* ════════════════════ SIMPLE HEADER ════════════════════ */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BackToDashboardButton />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1a1a] tracking-tight">
                            Transport
                        </h1>
                        <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mt-4"></div>
                    </motion.div>

                    {/* Search + Voice */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 max-w-xl mx-auto"
                    >
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 text-lg pointer-events-none">🔍</span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search transport companies..."
                                className="w-full pl-11 pr-14 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 font-semibold text-sm shadow-sm focus:outline-none focus:border-indigo-400 transition-all duration-300"
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-14 text-slate-400 hover:text-slate-700 text-lg transition"
                                    >✕</motion.button>
                                )}
                            </AnimatePresence>
                            {voiceSupported && (
                                <motion.button
                                    type="button"
                                    onClick={toggleListening}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`absolute right-3 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300
                                        ${isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}
                                >
                                    🎤
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Voice Modal */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                        onClick={cancelListening}
                    >
                        <motion.div
                            initial={{ scale: 0.85, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center"
                        >
                            <div className="relative flex items-center justify-center mb-8">
                                <span className="absolute w-24 h-24 rounded-full bg-red-100 animate-ping opacity-60" />
                                <span className="absolute w-16 h-16 rounded-full bg-red-200 animate-ping opacity-40" style={{ animationDelay: '0.2s' }} />
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl text-4xl">🎤</div>
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">Listening...</p>
                            <div className="min-h-[56px] bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 mb-6">
                                {voiceText
                                    ? <p className="text-slate-800 font-semibold text-base">"{voiceText}"</p>
                                    : <p className="text-slate-400 text-sm font-medium">بولیں... 🎙️</p>}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={cancelListening}
                                    className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:border-slate-300 transition"
                                >Cancel</button>
                                {voiceText && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        type="button"
                                        onClick={confirmVoice}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-md hover:opacity-90 transition"
                                    >Search ✓</motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-3 mt-10 mb-6">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => setFilter(cat.key)}
                        className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${filter === cat.key
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* ════════════════════ BODY ════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── Error ── */}
                {error && (
                    <div className="text-center py-28 text-slate-400">
                        <p>{error}</p>
                    </div>
                )}

                {/* ── Loading skeletons ── */}
                {loading && !error && (
                    <div className="flex flex-wrap justify-center gap-10">
                        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
                    </div>
                )}

                {/* ── Company cards grid ── */}
                {!loading && !error && (
                    <div className="flex flex-wrap justify-center gap-10">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((company, index) => {
                                const brand = BRAND[company.code] || DEFAULT_BRAND
                                return (
                                    <CompanyCard
                                        key={company.id}
                                        company={company}
                                        brand={brand}
                                        index={index}
                                        loaded={loaded}
                                        onClick={() => navigate(`/transport/${company.code}`, { state: { company } })}
                                    />
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                        {searchQuery ? `No operators found matching "${searchQuery}"` : 'No operators found.'}
                    </div>
                )}
            </div>
        </div >
    )
}

/* ─── Company Card ──────────────────────────────────────────────────────────── */
function CompanyCard({ company, brand, index, loaded, onClick }) {
    const typeIcon = TYPE_ICON[company.type] || '🚗'

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            onClick={onClick}
            className="group relative w-[300px] h-[300px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={brand.image}
                    alt={company.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl">
                        {typeIcon}
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest text-white rounded-full">
                        {brand.badge}
                    </span>
                </div>

                <h3 className="text-3xl font-black text-white mb-1.5 tracking-tight group-hover:text-amber-400 transition-colors">
                    {company.name}
                </h3>

                <div className="mt-6 flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.25em] group-hover:gap-5 transition-all duration-300">
                    <span>View Routes</span>
                    <span className="text-xl">→</span>
                </div>
            </div>

            {/* Hover Border Glow */}
            <div className="absolute inset-0 border-[2.5px] border-white/0 group-hover:border-white/20 rounded-[3rem] transition-colors duration-500" />
        </motion.article>
    )
}
