import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

const PAKISTAN_AIRLINES = [
    {
        code: 'PK',
        name: 'PIA',
        fullName: 'Pakistan International Airlines',
        accentColor: '#00a651',
        emoji: '🟢',
        badge: 'National Carrier',
        image: 'https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=800',
    },
    {
        code: 'PA',
        name: 'Airblue',
        fullName: 'Airblue',
        accentColor: '#0052cc',
        emoji: '🔵',
        badge: 'Modern Fleet',
        image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=800',
    },
    {
        code: 'ER',
        name: 'SereneAir',
        fullName: 'SereneAir',
        accentColor: '#6d28d9',
        emoji: '🟣',
        badge: 'Premium Experience',
        image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&q=80&w=800',
    },
    {
        code: 'PF',
        name: 'AirSial',
        fullName: 'AirSial',
        accentColor: '#d97706',
        emoji: '🟡',
        badge: 'Hospitality First',
        image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=800',
    },
    {
        code: 'FJ',
        name: 'Fly Jinnah',
        fullName: 'Fly Jinnah',
        accentColor: '#dc2626',
        emoji: '🔴',
        badge: 'Low Cost Hub',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=800',
    },
];

const FlightsPage = () => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
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

    useEffect(() => { setLoaded(true); }, []);

    const filteredAirlines = PAKISTAN_AIRLINES.filter(a =>
        searchQuery.trim() === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BackToDashboardButton />

                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1a1a] tracking-tight">Flights</h1>
                        <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mt-4"></div>
                    </motion.div>

                    {/* Search + Voice */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 max-w-xl mx-auto">
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 text-lg pointer-events-none">🔍</span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search airlines..."
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

            {/* Airlines Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {filteredAirlines.length === 0 ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-500 font-medium py-16">
                        No airlines found for "{searchQuery}"
                    </motion.p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-10">
                        <AnimatePresence>
                            {filteredAirlines.map((airline, index) => (
                                <motion.div
                                    key={airline.code}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={loaded ? { opacity: 1, scale: 1 } : {}}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    onClick={() => navigate(`/flights/${airline.code}`)}
                                    className="group relative w-[300px] h-[300px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="absolute inset-0">
                                        <img src={airline.image} alt={airline.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    </div>
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl">✈️</div>
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-1.5 tracking-tight group-hover:text-indigo-400 transition-colors">{airline.name}</h3>
                                        <p className="text-white/70 text-base font-medium line-clamp-1">{airline.fullName}</p>
                                        <div className="mt-6 flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.25em] group-hover:gap-5 transition-all duration-300">
                                            <span>Select Airline</span><span className="text-xl">→</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 border-[2.5px] border-white/0 group-hover:border-white/20 rounded-[3rem] transition-colors duration-500" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightsPage;
