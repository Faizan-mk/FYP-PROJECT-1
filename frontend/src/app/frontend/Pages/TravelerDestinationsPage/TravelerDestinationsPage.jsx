import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { destinationService } from '../../src/services/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop';

const FILTERS = ['All', 'Beach', 'Mountain', 'City', 'Desert', 'Culture', 'Adventure'];
const SORT_OPTIONS = [
    { id: 'newest', label: 'Newest' },
    { id: 'name', label: 'A–Z' },
];

const POLL_MS = 60000;

function normalizeList(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    return [];
}

function popularityLabel(dest) {
    if (dest?.matchReason) return dest.matchReason;
    const count = dest?.tripCount;
    if (typeof count === 'number' && count > 0) {
        return `${count} trip${count > 1 ? 's' : ''} planned`;
    }
    return 'Trending pick';
}

function interestParamsFromShortlist(shortlist) {
    const types = [...new Set(shortlist.map((d) => d?.type).filter(Boolean))];
    const exclude = shortlist.map((d) => d?.name).filter(Boolean);
    return { types, exclude };
}

function readSavedShortlist() {
    try {
        const saved = localStorage.getItem('selectedDestinations');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

const TravelerDestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [addedDestinations, setAddedDestinations] = useState(readSavedShortlist);

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
    const searchWrapRef = useRef(null);
    const suggestTimerRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Traveler';

    useEffect(() => {
        const initial = location.state?.initialSearch;
        if (typeof initial === 'string' && initial.trim()) {
            setSearchQuery(initial.trim());
            setShowSuggestions(true);
        }
    }, [location.state?.initialSearch]);

    useEffect(() => {
        let cancelled = false;
        const run = async (silent) => {
            if (!silent) {
                setFetchError('');
                setLoading(true);
            }
            try {
                const raw = await destinationService.getAllDestinations();
                if (cancelled) return;
                const list = normalizeList(raw).filter((d) => d && d.name != null && d.id != null && d.id !== '');
                setDestinations(list);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
                if (!cancelled && !silent) {
                    setFetchError(error?.message || 'Could not load destinations. Is the API running?');
                    setDestinations([]);
                }
            } finally {
                if (!cancelled && !silent) setLoading(false);
            }
        };
        run(false);
        const intervalId = setInterval(() => run(true), POLL_MS);
        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, []);

    const interestParams = useMemo(
        () => interestParamsFromShortlist(addedDestinations),
        [addedDestinations]
    );

    useEffect(() => {
        if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);

        suggestTimerRef.current = setTimeout(async () => {
            try {
                const raw = await destinationService.getDestinationSuggestions(searchQuery, 8, {
                    types: interestParams.types,
                    exclude: interestParams.exclude,
                });
                setSearchSuggestions(normalizeList(raw));
            } catch (err) {
                console.error('Failed to fetch destination suggestions:', err);
                setSearchSuggestions([]);
            }
        }, searchQuery.trim() ? 220 : 0);

        return () => {
            if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
        };
    }, [searchQuery, interestParams.types.join(','), interestParams.exclude.join(',')]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredDestinations = useMemo(() => {
        let list = destinations.filter((d) => {
            if (!d || d.name == null || d.id == null || d.id === '') return false;
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                (d.name && d.name.toLowerCase().includes(q)) ||
                (d.type && d.type.toLowerCase().includes(q));
            const matchesFilter = activeFilter === 'All' || d.type === activeFilter;
            return matchesSearch && matchesFilter;
        });

        if (sortBy === 'name') {
            list = [...list].sort((a, b) => String(a.name).localeCompare(String(b.name)));
        } else {
            list = [...list].sort((a, b) => {
                const ta = new Date(a.createdAt || 0).getTime();
                const tb = new Date(b.createdAt || 0).getTime();
                return tb - ta;
            });
        }
        return list;
    }, [destinations, searchQuery, activeFilter, sortBy]);

    const handleToggleDestination = (e, dest) => {
        e.preventDefault();
        e.stopPropagation();
        setAddedDestinations((prev) => {
            const isAdded = prev.find((item) => item.id === dest.id);
            const newList = isAdded ? prev.filter((item) => item.id !== dest.id) : [...prev, dest];
            localStorage.setItem('selectedDestinations', JSON.stringify(newList));
            return newList;
        });
    };

    const isDestAdded = (id) => addedDestinations.some((d) => d.id === id);

    const guideUrl = (dest) =>
        `/traveler/destinations/${encodeURIComponent(String(dest.id))}`;

    const applySuggestion = (name) => {
        setSearchQuery(name);
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    };

    const suggestionList = searchQuery.trim().length > 0 ? searchSuggestions : [];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BackToDashboardButton />

                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center md:text-left"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1a1a1a] tracking-tight">
                            Destinations
                        </h1>
                        <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-4 mx-auto md:mx-0" />
                        
                        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                            <Link
                                to="/packages"
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white font-black text-sm px-6 py-3 shadow-lg hover:bg-slate-800 transition-colors"
                            >
                                <span aria-hidden>🧳</span> View all packages
                            </Link>
                        </div>
                    </motion.div>

                    <div className="mt-10 flex flex-col lg:flex-row gap-4 lg:items-stretch lg:justify-between">
                        <div
                            ref={searchWrapRef}
                            className="relative flex-1 min-w-0 bg-white p-2 rounded-2xl shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col sm:flex-row gap-2"
                        >
                            <div className="relative group flex-1 min-w-[240px] flex items-center">
                                <span className="absolute left-4 text-xl pointer-events-none select-none">🔍</span>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search by name or category…"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    className="w-full pl-11 pr-24 py-3.5 bg-transparent rounded-xl border-none focus:ring-0 outline-none font-bold text-slate-800 text-sm"
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
                                        >
                                            ✕
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                {voiceSupported && (
                                    <motion.button
                                        type="button"
                                        onClick={toggleListening}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        className={`absolute right-2 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300 ${
                                            isListening
                                                ? 'bg-red-500 text-white shadow-lg animate-pulse'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                        }`}
                                    >
                                        🎤
                                    </motion.button>
                                )}
                            </div>

                            <AnimatePresence>
                                {showSuggestions && suggestionList.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="absolute left-2 right-2 top-full mt-2 z-30 bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 overflow-hidden"
                                    >
                                        <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                                            Suggestions
                                        </p>
                                        <ul className="max-h-64 overflow-y-auto py-1">
                                            {suggestionList.map((item) => (
                                                <li key={item.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => applySuggestion(item.name)}
                                                        className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center gap-3 transition"
                                                    >
                                                        <img
                                                            src={item.image || FALLBACK_IMAGE}
                                                            alt=""
                                                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                                                        />
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block font-bold text-slate-900 text-sm truncate">
                                                                {item.name}
                                                            </span>
                                                            <span className="block text-xs text-slate-500 font-semibold truncate">
                                                                {item.isAiPick && (
                                                                    <span className="text-violet-600 font-black mr-1">
                                                                        AI ·
                                                                    </span>
                                                                )}
                                                                {item.type} · {popularityLabel(item)}
                                                            </span>
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/create-trip', { state: { destinations: addedDestinations } })
                                }
                                disabled={addedDestinations.length === 0}
                                className="px-6 py-3.5 shrink-0 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl font-black text-sm shadow-md shadow-indigo-200/50 hover:opacity-95 transition-all disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                Plan trip ({addedDestinations.length})
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest w-full lg:w-auto text-center lg:text-right">
                                Sort
                            </span>
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setSortBy(opt.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border-2 ${
                                        sortBy === opt.id
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setActiveFilter(f)}
                                className={`px-5 py-2.5 rounded-full text-sm font-black transition-all ${
                                    activeFilter === f
                                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/50'
                                        : 'bg-white text-slate-600 ring-2 ring-slate-200 hover:ring-indigo-200 hover:bg-indigo-50/40'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center"
                        >
                            <div className="relative flex items-center justify-center mb-8">
                                <span className="absolute w-24 h-24 rounded-full bg-red-100 animate-ping opacity-60" />
                                <span
                                    className="absolute w-16 h-16 rounded-full bg-red-200 animate-ping opacity-40"
                                    style={{ animationDelay: '0.2s' }}
                                />
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl text-4xl">
                                    🎤
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">
                                Listening…
                            </p>
                            <div className="min-h-[56px] bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 mb-6">
                                {voiceText ? (
                                    <p className="text-slate-800 font-semibold text-base">&ldquo;{voiceText}&rdquo;</p>
                                ) : (
                                    <p className="text-slate-400 text-sm font-medium">Speak to search…</p>
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
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-md hover:opacity-90 transition"
                                    >
                                        Search ✓
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
                {fetchError && (
                    <div className="mb-8 max-w-2xl mx-auto rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm font-semibold text-center">
                        {fetchError}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-600 font-bold">Loading destinations…</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        <AnimatePresence>
                            {filteredDestinations.length > 0 ? (
                                filteredDestinations.map((dest, i) => (
                                    <motion.div
                                        key={String(dest.id)}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: Math.min(i * 0.04, 0.4) }}
                                        className="flex flex-col group"
                                    >
                                        <div className="relative aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden mb-5 shadow-md ring-1 ring-slate-100 group-hover:shadow-2xl group-hover:shadow-indigo-100/80 transition-all duration-500">
                                            <Link
                                                to={guideUrl(dest)}
                                                aria-label={`Open travel guide: ${dest.name}`}
                                                className="absolute inset-0 z-0 rounded-[2.5rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa]"
                                            />
                                            <img
                                                src={dest.image || FALLBACK_IMAGE}
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-900/88 via-slate-900/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />
                                            <div className="absolute top-5 right-5 z-20">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleDestination(e, dest)}
                                                    aria-label={
                                                        isDestAdded(dest.id)
                                                            ? 'Remove from shortlist'
                                                            : 'Add to shortlist'
                                                    }
                                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all font-black text-lg shadow-md ${
                                                        isDestAdded(dest.id)
                                                            ? 'bg-emerald-500 text-black shadow-emerald-300/50'
                                                            : 'bg-white/95 text-slate-900 hover:bg-white hover:scale-105'
                                                    }`}
                                                >
                                                    {isDestAdded(dest.id) ? '✓' : '+'}
                                                </button>
                                            </div>
                                            <div className="absolute bottom-6 left-6 right-6 z-[1] pointer-events-none">
                                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-widest border border-white/30">
                                                    {dest.type}
                                                </span>
                                                <h3 className="text-2xl font-black text-white mt-2 leading-tight group-hover:text-indigo-200 transition-colors">
                                                    {dest.name}
                                                </h3>
                                                <p className="flex items-center gap-2 mt-2 text-white/90 text-sm font-bold">
                                                    <span aria-hidden>🌡️</span>
                                                    {dest.weather || 'Great time to visit'}
                                                </p>
                                                <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/95 text-indigo-700 px-4 py-2 text-xs font-black uppercase tracking-wide shadow-lg">
                                                    Open guide
                                                    <span aria-hidden className="text-base">
                                                        →
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center px-4">
                                    <div className="text-8xl mb-6 opacity-[0.12] grayscale select-none">🧭</div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                        No destinations match
                                    </h3>
                                    <p className="text-slate-600 font-semibold max-w-md mx-auto">
                                        {searchQuery
                                            ? `Nothing for “${searchQuery}”. Try another search or clear filters.`
                                            : activeFilter !== 'All'
                                              ? `No ${activeFilter} destinations right now. Pick “All” or another category.`
                                              : 'No destinations loaded yet. Check the API or add places from the admin panel.'}
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="mt-16 flex justify-center border-t border-slate-200 pt-10">
                    <button
                        type="button"
                        onClick={() => navigate('/traveler/flights')}
                        className="group flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-sm md:text-base shadow-lg hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98]"
                    >
                        <span>Next: find flights</span>
                        <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-900 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors">
                            →
                        </span>
                    </button>
                </div>
            </div>

            {addedDestinations.length > 0 && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] max-w-[95vw] w-full sm:w-auto px-2"
                >
                    <div className="bg-slate-900 text-white px-6 sm:px-8 py-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-2 border-indigo-500/80">
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">
                                Shortlist
                            </p>
                            <p className="text-base font-black truncate">
                                {addedDestinations.length} spot{addedDestinations.length > 1 ? 's' : ''} selected
                            </p>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-white/20 shrink-0" />
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/create-trip', { state: { destinations: addedDestinations } })
                            }
                            className="shrink-0 bg-indigo-500 hover:bg-indigo-400 text-blue-900 px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-[0.98]"
                        >
                            Start planning
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TravelerDestinationsPage;
