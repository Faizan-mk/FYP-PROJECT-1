import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { PackageCard, formatPkr } from '../../components/LiveTravelPackages';
import { travelPackageService, destinationService } from '../../src/services/api';

const FALLBACK_DEST_IMAGE =
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop';

function normalizeDestList(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    return [];
}

const DEFAULT_POLL_MS = 30000;

const TYPE_FILTERS = [
    { id: '', label: 'All types' },
    { id: 'solo', label: 'Solo' },
    { id: 'group', label: 'Group (3)' },
    { id: 'family', label: 'Family' },
];

const TravelPackagesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const destFromUrl = searchParams.get('destination') || '';
    const typeFromUrl = searchParams.get('type') || '';

    const [destinationQuery, setDestinationQuery] = useState(destFromUrl);
    const [typeFilter, setTypeFilter] = useState(
        TYPE_FILTERS.some((t) => t.id === typeFromUrl) ? typeFromUrl : ''
    );
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [meta, setMeta] = useState({ fetchedAt: '', pollIntervalMs: DEFAULT_POLL_MS });
    const [pollMs, setPollMs] = useState(DEFAULT_POLL_MS);
    const [liveRefreshing, setLiveRefreshing] = useState(false);
    const [countdownSec, setCountdownSec] = useState(Math.floor(DEFAULT_POLL_MS / 1000));
    const [pricingMeta, setPricingMeta] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [destinationsLoading, setDestinationsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const raw = await destinationService.getAllDestinations();
                if (cancelled) return;
                const list = normalizeDestList(raw).filter((d) => d && d.id != null && d.name);
                setDestinations(list);
            } catch {
                if (!cancelled) setDestinations([]);
            } finally {
                if (!cancelled) setDestinationsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setDestinationQuery(destFromUrl);
        if (TYPE_FILTERS.some((t) => t.id === typeFromUrl)) setTypeFilter(typeFromUrl);
    }, [destFromUrl, typeFromUrl]);

    const load = useCallback(
        async (silent) => {
            if (!silent) {
                setLoading(true);
                setError('');
            } else {
                setLiveRefreshing(true);
            }
            try {
                const res = await travelPackageService.getPackages({
                    destination: destinationQuery.trim(),
                    type: typeFilter,
                    limit: 120,
                });
                const list = Array.isArray(res?.data) ? res.data : [];
                setPacks(list);
                const nextPoll =
                    typeof res?.pollIntervalMs === 'number' && res.pollIntervalMs >= 5000
                        ? res.pollIntervalMs
                        : DEFAULT_POLL_MS;
                setPollMs(nextPoll);
                setMeta({
                    fetchedAt: res?.fetchedAt || new Date().toISOString(),
                    pollIntervalMs: nextPoll,
                });
                setPricingMeta(res?.pricing ?? null);
            } catch (e) {
                if (!silent) {
                    setError(e?.message || 'Could not load tour packages.');
                    setPacks([]);
                }
            } finally {
                if (!silent) setLoading(false);
                if (silent) setLiveRefreshing(false);
            }
        },
        [destinationQuery, typeFilter]
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (cancelled) return;
            await load(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [load]);

    useEffect(() => {
        const t = setInterval(() => {
            load(true);
        }, pollMs);
        return () => clearInterval(t);
    }, [load, pollMs]);

    const pollSec = Math.max(1, Math.floor(pollMs / 1000));

    useEffect(() => {
        const id = setInterval(() => {
            setCountdownSec((c) => Math.max(0, c - 1));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (meta.fetchedAt) {
            setCountdownSec(pollSec);
        }
    }, [meta.fetchedAt, pollSec]);

    const applyFiltersToUrl = () => {
        const next = new URLSearchParams();
        if (destinationQuery.trim()) next.set('destination', destinationQuery.trim());
        if (typeFilter) next.set('type', typeFilter);
        setSearchParams(next, { replace: true });
    };

    const selectDestinationFilter = (name) => {
        setDestinationQuery(name);
        const next = new URLSearchParams();
        if (name.trim()) next.set('destination', name.trim());
        if (typeFilter) next.set('type', typeFilter);
        setSearchParams(next, { replace: true });
    };

    const clearDestinationFilter = () => {
        setDestinationQuery('');
        const next = new URLSearchParams();
        if (typeFilter) next.set('type', typeFilter);
        setSearchParams(next, { replace: true });
    };

    const lowestCurrent = useMemo(() => {
        if (!packs.length) return null;
        return packs.reduce((m, p) => Math.min(m, p.currentPricePKR), Infinity);
    }, [packs]);

    const timeLabel = meta.fetchedAt
        ? new Date(meta.fetchedAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : '';

    return (
        <div className="min-h-screen bg-[#fafafa] pb-28">
            <div className="bg-gradient-to-b from-teal-950 via-slate-900 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                    <BackToDashboardButton />
                    <div className="mt-8 flex flex-wrap gap-3 justify-between items-start">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                            <p className="text-teal-300 text-xs font-black uppercase tracking-[0.25em]">
                                Pakistan &amp; regional tours
                            </p>
                            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-2">
                                Travel packages
                            </h1>

                        </motion.div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                to="/destination"
                                className="inline-flex items-center rounded-2xl bg-white/10 border border-white/25 px-5 py-3 text-sm font-black hover:bg-white/15 transition-colors"
                            >
                                ← Destinations
                            </Link>
                            <Link
                                to="/traveler/hotels"
                                className="inline-flex items-center rounded-2xl bg-teal-500 text-slate-950 px-5 py-3 text-sm font-black hover:bg-teal-400 transition-colors"
                            >
                                Hotels
                            </Link>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-7 rounded-[2rem] bg-white/5 border border-white/15 p-5 sm:p-6 backdrop-blur-md">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-teal-200/90 mb-2">
                                Match a place
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="search"
                                    value={destinationQuery}
                                    onChange={(e) => setDestinationQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFiltersToUrl()}
                                    placeholder="e.g. Hunza, Skardu, Lahore…"
                                    className="flex-1 rounded-2xl bg-white/95 text-slate-900 font-bold px-5 py-3.5 border-0 shadow-inner"
                                />
                                <button
                                    type="button"
                                    onClick={applyFiltersToUrl}
                                    className="rounded-2xl bg-white text-slate-900 font-black px-6 py-3.5 hover:bg-teal-100 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-5 rounded-[2rem] bg-teal-500/20 border border-teal-300/30 p-5 sm:p-6">
                            <p className="text-[11px] font-black uppercase tracking-widest text-teal-100 mb-3">
                                Package type
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {TYPE_FILTERS.map((t) => (
                                    <button
                                        key={t.id || 'all'}
                                        type="button"
                                        onClick={() => {
                                            setTypeFilter(t.id);
                                            const next = new URLSearchParams(searchParams);
                                            if (t.id) next.set('type', t.id);
                                            else next.delete('type');
                                            if (destinationQuery.trim()) next.set('destination', destinationQuery.trim());
                                            else next.delete('destination');
                                            setSearchParams(next, { replace: true });
                                        }}
                                        className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide transition-all ${typeFilter === t.id
                                                ? 'bg-teal-400 text-slate-950 shadow-lg'
                                                : 'bg-white/10 text-blue-900 hover:bg-white/15'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            {lowestCurrent != null && Number.isFinite(lowestCurrent) && (
                                <p className="mt-5 text-sm font-bold text-teal-50">

                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <section
                    className="mb-8 rounded-3xl bg-white border border-slate-100 shadow-lg p-5 sm:p-6"
                    aria-label="Destinations"
                >
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                        <div>
                            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                                Destinations
                            </p>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                                Choose a place — packages filter below
                            </h2>
                        </div>
                        <Link
                            to="/destination"
                            className="text-sm font-black text-indigo-600 hover:text-indigo-800 hover:underline shrink-0"
                        >
                            Open destination guides →
                        </Link>
                    </div>
                    {destinationsLoading ? (
                        <p className="text-slate-500 text-sm font-semibold py-4">Loading destinations…</p>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                            <button
                                type="button"
                                onClick={clearDestinationFilter}
                                className={`snap-start shrink-0 w-[112px] rounded-2xl p-4 text-left font-black text-sm transition-all border-2 ${!destinationQuery.trim()
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md'
                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                All places
                            </button>
                            {destinations.map((d) => {
                                const active = destinationQuery.trim() === d.name;
                                return (
                                    <button
                                        key={String(d.id)}
                                        type="button"
                                        onClick={() => selectDestinationFilter(d.name)}
                                        className={`snap-start shrink-0 w-[160px] sm:w-[180px] text-left rounded-2xl overflow-hidden ring-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${active
                                                ? 'ring-indigo-500 shadow-lg'
                                                : 'ring-transparent hover:ring-slate-200 shadow-md'
                                            }`}
                                    >
                                        <div className="relative aspect-[4/5]">
                                            <img
                                                src={d.image || FALLBACK_DEST_IMAGE}
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/92 via-slate-900/20 to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-white font-black text-sm leading-tight line-clamp-2">
                                                    {d.name}
                                                </p>
                                                <p className="text-white/80 text-[10px] font-bold mt-1 uppercase tracking-wide">
                                                    {d.type}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 font-semibold">
                        {error}
                    </div>
                )}


                {loading && packs.length === 0 ? (
                    <div className="flex flex-col items-center py-24 gap-4">
                        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-600 font-bold">Loading packages…</p>
                    </div>
                ) : packs.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4 opacity-20">📦</p>
                        <h2 className="text-2xl font-black text-slate-900">No packages match</h2>
                        <p className="text-slate-600 font-semibold mt-2">Try another destination or clear filters.</p>
                        <button
                            type="button"
                            onClick={() => {
                                setDestinationQuery('');
                                setTypeFilter('');
                                setSearchParams({}, { replace: true });
                            }}
                            className="mt-6 rounded-2xl bg-slate-900 text-white font-black px-6 py-3"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                        {packs.map((p, i) => (
                            <PackageCard key={p.id} pkg={p} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelPackagesPage;
