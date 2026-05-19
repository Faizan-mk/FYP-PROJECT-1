import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { hotelService } from '../../src/services/api';
import { useNavigate } from 'react-router-dom';

const FALLBACK_HOTEL_IMAGE =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';

/** Match backend `hotelApiController` price window (~30s). */
const HOTELS_REFRESH_MS = 30000;

const TravelerHotelsPage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [selectedRating, setSelectedRating] = useState('all');

    // Search + Voice states
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

    useEffect(() => {
        let cancelled = false;

        const loadHotels = async (silent) => {
            if (!silent) {
                setError('');
                setLoading(true);
            }
            try {
                const data = await hotelService.getLiveHotels();
                if (!cancelled) {
                    setHotels(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError(e?.message || 'Failed to load hotels.');
                    if (!silent) setHotels([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadHotels(false);
        const intervalId = setInterval(() => loadHotels(true), HOTELS_REFRESH_MS);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (!loading) setLoaded(true);
    }, [loading]);

    const openDetail = (hotel) => {
        navigate(`/traveler/hotels/${hotel.id}`);
    };

    // ── Filtered Hotels ──
    const getFilteredHotels = () => {
        let result = selectedRating === 'all'
            ? hotels
            : hotels.filter(h => Number(h.stars) === selectedRating);

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(h =>
                h.name?.toLowerCase().includes(q) ||
                h.city?.toLowerCase().includes(q) ||
                h.location?.toLowerCase().includes(q)
            );
        }
        return result;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-600">Loading hotels…</p>
                </div>
            </div>
        );
    }

    const filteredHotels = getFilteredHotels();

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BackToDashboardButton />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1a1a] tracking-tight">
                            Hotels
                        </h1>
                        <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mt-4" />
                        <div className="mt-5 flex justify-center text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-900 px-3 py-1.5 font-bold border border-emerald-100">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                Live rates
                            </span>
                        </div>
                    </motion.div>

                    {/* ── Search Bar with Voice Icon ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 max-w-xl mx-auto"
                    >
                        <div className="relative flex items-center">
                            {/* Search Icon */}
                            <span className="absolute left-4 text-slate-400 text-lg pointer-events-none select-none">
                                🔍
                            </span>

                            {/* Input */}
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search hotels by name or city..."
                                className="w-full pl-11 pr-14 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 font-semibold text-sm shadow-sm focus:outline-none focus:border-indigo-400 focus:shadow-indigo-100 focus:shadow-md transition-all duration-300"
                            />

                            {/* Clear button */}
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-14 text-slate-400 hover:text-slate-700 text-lg transition"
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Mic Button */}
                            {voiceSupported && (
                                <motion.button
                                    type="button"
                                    onClick={toggleListening}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`absolute right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 text-base
                                        ${isListening
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-300/50 animate-pulse'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-300/40'
                                        }`}
                                >
                                    🎤
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Voice Listening Modal ── */}
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
                            initial={{ scale: 0.85, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center"
                        >
                            {/* Pulse Rings */}
                            <div className="relative flex items-center justify-center mb-8">
                                <span className="absolute w-24 h-24 rounded-full bg-red-100 animate-ping opacity-60" />
                                <span className="absolute w-16 h-16 rounded-full bg-red-200 animate-ping opacity-40" style={{ animationDelay: '0.2s' }} />
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl shadow-red-300/50 text-4xl">
                                    🎤
                                </div>
                            </div>

                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">
                                Listening...
                            </p>

                            {/* Live transcript */}
                            <div className="min-h-[56px] bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 mb-6">
                                {voiceText ? (
                                    <p className="text-slate-800 font-semibold text-base leading-snug">
                                        "{voiceText}"
                                    </p>
                                ) : (
                                    <p className="text-slate-400 text-sm font-medium">
                                        بولیں... 🎙️
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={cancelListening}
                                    className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:border-slate-300 transition"
                                >
                                    Cancel
                                </button>
                                {voiceText && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        type="button"
                                        onClick={confirmVoice}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-md shadow-indigo-300/40 hover:opacity-90 transition"
                                    >
                                        Search ✓
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <div className="mb-10 max-w-xl mx-auto rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm font-semibold text-center">
                        {error}
                    </div>
                )}

                {/* ── Rating Filter ── */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl px-3 py-3 shadow-lg shadow-slate-200/50">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 1, label: '1 ★' },
                            { key: 2, label: '2 ★' },
                            { key: 3, label: '3 ★' },
                            { key: 4, label: '4 ★' },
                            { key: 5, label: '5 ★' },
                        ].map(({ key, label }) => {
                            const isActive = selectedRating === key;
                            return (
                                <motion.button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedRating(key)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                    className={`relative px-5 py-2 rounded-xl text-sm font-black transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-400/40'
                                            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 -z-10"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    {label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Hotel Cards ── */}
                {filteredHotels.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-500 font-medium py-16"
                    >
                        {searchQuery
                            ? `No hotels found for "${searchQuery}"`
                            : `No hotels found with ${selectedRating} star${selectedRating !== 1 ? 's' : ''}.`}
                    </motion.p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-10">
                        <AnimatePresence>
                            {filteredHotels.map((hotel, index) => {
                                const img = hotel.image || FALLBACK_HOTEL_IMAGE;
                                const stars = Math.min(Number(hotel.stars) || 0, 5);
                                return (
                                    <motion.div
                                        key={hotel.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={loaded ? { opacity: 1, scale: 1 } : {}}
                                        exit={{ opacity: 0, scale: 0.85 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                        onClick={() => openDetail(hotel)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') openDetail(hotel);
                                        }}
                                        className="group relative w-[300px] h-[300px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
                                    >
                                        <div className="absolute inset-0">
                                            <img
                                                src={img}
                                                alt={hotel.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                        </div>

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl">
                                                    🏨
                                                </div>
                                                {stars > 0 && (
                                                    <span className="text-amber-300 text-sm font-black tracking-wide">
                                                        {'★'.repeat(stars)}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                {hotel.name}
                                            </h3>
                                            <p className="text-white/80 text-sm font-semibold">
                                                From Rs. {Number(hotel.price || 0).toLocaleString()}
                                                {hotel.rating != null && (
                                                    <span className="text-white/60 ml-2">
                                                        · {Number(hotel.rating).toFixed(1)} rating
                                                    </span>
                                                )}
                                            </p>

                                            <div className="mt-6 flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.25em] group-hover:gap-5 transition-all duration-300">
                                                <span>View details</span>
                                                <span className="text-xl">→</span>
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 border-[2.5px] border-white/0 group-hover:border-white/20 rounded-[3rem] transition-colors duration-500" />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerHotelsPage;
