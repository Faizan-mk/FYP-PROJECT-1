import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const REFRESH_INTERVAL = 20;

const TravelerTransportPage = () => {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
    const countdownRef = useRef(null);

    // Voice search states
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const {
        isListening,
        voiceText,
        voiceSupported,
        inputValue,
        cancelListening,
        confirmVoice,
        toggleListening,
    } = useVoiceSearch({ searchQuery, setSearchQuery, focusRef: searchInputRef });

    const fetchTransports = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/transport/all-routes`);
            const json = await res.json();
            if (json.success) {
                setTransports(json.data);
                setLastRefreshed(new Date());
                setCountdown(REFRESH_INTERVAL);
            }
        } catch (error) {
            console.error('Error fetching live transport feed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransports();
        const interval = setInterval(() => fetchTransports(true), REFRESH_INTERVAL * 1000);
        countdownRef.current = setInterval(() => {
            setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
        }, 1000);
        return () => { clearInterval(interval); clearInterval(countdownRef.current); };
    }, [fetchTransports]);

    const handleBookClick = (id) => {
        window.open(`${API_BASE}/api/redirect/transport/${id}`, '_blank');
    };

    const categoryIcons = { all: '🗺️', bus: '🚌', train: '🚂', car: '🚗' };

    const filtered = transports.filter(t => {
        const matchCat = filter === 'all' || t.type === filter;
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || t.company_name?.toLowerCase().includes(q) ||
            t.from_city?.toLowerCase().includes(q) || t.to_city?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <BackToDashboardButton />
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">
                            📡 Real-Time Network Feed
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                            Live <span className="text-indigo-600">Transport.</span>
                        </h1>
                        <p className="mt-6 text-slate-500 font-medium max-w-xl text-lg leading-relaxed">
                            Simulated demand-based pricing and live seat availability across all major Pakistani routes.
                        </p>
                    </motion.div>

                    {/* Live indicator */}
                    <div className="flex items-center gap-4 mt-8 px-6 py-3 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-xs font-black text-slate-900 uppercase">System Status: Live</span>
                            <span className="text-[10px] text-slate-400 font-bold mt-1">
                                Updating in {countdown}s · {lastRefreshed?.toLocaleTimeString('en-PK')}
                            </span>
                        </div>
                        <button onClick={() => fetchTransports(false)}
                            className="ml-4 p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600 active:rotate-180">↻</button>
                    </div>

                    {/* Search + Voice */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 w-full max-w-xl">
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 text-lg pointer-events-none">🔍</span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by city or company..."
                                className="w-full pl-11 pr-14 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 font-semibold text-sm shadow-sm focus:outline-none focus:border-indigo-400 transition-all duration-300"
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                        type="button" onClick={() => setSearchQuery('')}
                                        className="absolute right-14 text-slate-400 hover:text-slate-700 text-lg transition">✕</motion.button>
                                )}
                            </AnimatePresence>
                            {voiceSupported && (
                                <motion.button type="button" onClick={toggleListening}
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    className={`absolute right-3 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300
                                        ${isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}>
                                    🎤
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Voice Modal */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                            onClick={cancelListening}>
                            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center">
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
                                    <button type="button" onClick={cancelListening}
                                        className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:border-slate-300 transition">Cancel</button>
                                    {voiceText && (
                                        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                            type="button" onClick={confirmVoice}
                                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-md hover:opacity-90 transition">
                                            Search ✓
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-3 mb-14">
                    {Object.keys(categoryIcons).map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)}
                            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2.5 ${filter === cat
                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-105'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'}`}>
                            <span>{categoryIcons[cat]}</span>{cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-black text-xs uppercase tracking-widest text-slate-400">Syncing Live Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((item) => {
                                const isCritical = item.seats_available <= 5;
                                const isLow = item.seats_available <= 15;
                                return (
                                    <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 group flex flex-col h-full">
                                        <div className="p-8 pb-4">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                    {item.company_logo}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{item.type}</span>
                                                    <span className="px-3 py-1 bg-slate-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">{item.seat_type}</span>
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{item.company_name}</h2>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Departing {item.departure_time}</p>
                                        </div>
                                        <div className="px-8 flex-1">
                                            <div className="flex items-center gap-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-50 mb-6">
                                                <div className="flex-1">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">From</p>
                                                    <p className="text-sm font-black text-slate-800 uppercase">{item.from_city}</p>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-[8px] font-black text-indigo-400 uppercase">{item.duration}</span>
                                                    <div className="w-8 h-px bg-indigo-100"></div>
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">To</p>
                                                    <p className="text-sm font-black text-slate-800 uppercase">{item.to_city}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 mb-8">
                                                <div className={`p-3 rounded-2xl flex items-center justify-between border transition-colors ${isCritical ? 'bg-rose-50 border-rose-100' : isLow ? 'bg-amber-50 border-amber-100' : 'bg-green-50/50 border-green-100/50'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">{isCritical ? '🚨' : '💺'}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-wider ${isCritical ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-green-600'}`}>
                                                            {isCritical ? 'Critical' : isLow ? 'Limited' : 'Available'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs font-black ${isCritical ? 'text-rose-500' : 'text-slate-700'}`}>{item.seats_available} Seats Left</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 pt-0 mt-auto border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Live Price</p>
                                                </div>
                                                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                                    <span className="text-xs text-slate-400 font-bold mr-1">PKR</span>
                                                    {Number(item.display_price || item.price).toLocaleString()}
                                                </p>
                                            </div>
                                            <button onClick={() => handleBookClick(item.id)}
                                                className="h-14 px-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center gap-3 group/btn">
                                                Book Seat <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 grayscale opacity-20">
                        <span className="text-7xl">🔭</span>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mt-4">Empty Frequency</h3>
                        <p className="text-sm font-medium text-slate-500">
                            {searchQuery ? `No routes found for "${searchQuery}"` : 'No live routes found matching this category.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerTransportPage;
