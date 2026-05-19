import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaPlus, FaCompass, FaLightbulb } from 'react-icons/fa';
import { destinationService } from '../../src/services/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop';

const TIPS_BY_TYPE = {
    Beach: [
        'Pack sunscreen, hat, and refillable water for shore days.',
        'Check weekend crowds; popular strips fill up early.',
        'Compare waterfront vs town stays for better value.',
    ],
    Mountain: [
        'Layer clothing — ridges and mornings can be much cooler.',
        'Confirm passes / road status before self-drive mountain legs.',
        'Add rest days if you are new to altitude.',
    ],
    City: [
        'Balance landmarks with one slow “local quarter” afternoon.',
        'Book museums or galleries ahead on weekends.',
        'Keep a photo backup of IDs separate from your wallet.',
    ],
    Desert: [
        'Carry extra water; heat and glare are harder than they look.',
        'Prefer guided legs for very remote stretches.',
        'Plan around midday heat for outdoor activities.',
    ],
    Culture: [
        'Dress modestly where communities expect it; read venue notes.',
        'Heritage sites often need timed tickets — reserve early.',
        'Support locals via one craft or food experience.',
    ],
    Adventure: [
        'Match activities to your fitness; ask operators about gear.',
        'Buffer a day for weather delays on outdoor legs.',
        'Share live location with your group on remote days.',
    ],
};

const DEFAULT_TIPS = [
    'Shortlist stays and routes here before locking final dates.',
    'Revisit after you pick hotels or transport for this hub.',
    'Enable trip notifications for budget and safety alerts.',
];

function readSelected() {
    try {
        const raw = localStorage.getItem('selectedDestinations');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeSelected(list) {
    localStorage.setItem('selectedDestinations', JSON.stringify(list));
}

function buildBlurb(d) {
    if (!d) return '';
    const type = (d.type || 'destination').toLowerCase();
    return `${d.name} is a curated ${type} pick in your explorer — anchor your trip here, then branch into hotels, transport, and day plans. Snapshot: ${d.weather || 'pleasant conditions'} in our current guide.`;
}

function tipsForType(type) {
    const key = typeof type === 'string' ? type.trim() : '';
    return TIPS_BY_TYPE[key] || DEFAULT_TIPS;
}

function formatListed(createdAt) {
    if (!createdAt) return null;
    try {
        const d = new Date(createdAt);
        if (Number.isNaN(d.getTime())) return null;
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return null;
    }
}

const TravelerDestinationDetailPage = () => {
    const params = useParams();
    const id = params.id ? decodeURIComponent(String(params.id)) : '';
    const navigate = useNavigate();
    const [dest, setDest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [inShortlist, setInShortlist] = useState(false);

    const tips = useMemo(() => (dest ? tipsForType(dest.type) : []), [dest]);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('Missing destination link.');
            setDest(null);
            return;
        }
        let cancelled = false;
        const load = async () => {
            setError('');
            setLoading(true);
            try {
                const data = await destinationService.getDestinationById(id);
                if (cancelled) return;
                setDest(data);
                const list = readSelected();
                setInShortlist(list.some((x) => String(x.id) === String(data.id)));
            } catch (e) {
                if (!cancelled) {
                    setError(e?.message || 'Destination not found.');
                    setDest(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const toggleShortlist = () => {
        if (!dest) return;
        const list = readSelected();
        const exists = list.some((x) => String(x.id) === String(dest.id));
        const next = exists ? list.filter((x) => String(x.id) !== String(dest.id)) : [...list, dest];
        writeSelected(next);
        setInShortlist(!exists);
    };

    const goPlan = () => navigate('/create-trip', { state: { destinations: readSelected() } });

    const listed = dest ? formatListed(dest.createdAt) : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-600">Loading guide…</p>
                </div>
            </div>
        );
    }

    if (!dest || error) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8">
                <p className="text-red-600 font-bold mb-2 text-center max-w-md">{error || 'Not found'}</p>
                <p className="text-slate-500 text-sm font-medium mb-6 text-center max-w-sm">
                    Link may be old or the listing was removed. Head back and pick another place.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link
                        to="/traveler/destinations"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-3 font-black text-sm hover:bg-indigo-700"
                    >
                        <FaArrowLeft /> All destinations
                    </Link>
                    <Link
                        to="/destination"
                        className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-3 font-black text-sm text-slate-800 hover:border-indigo-200"
                    >
                        Browse list
                    </Link>
                </div>
            </div>
        );
    }

    const img = dest.image || FALLBACK_IMG;

    return (
        <div className="min-h-screen bg-[#fafafa] pb-28">
            <div className="relative h-[48vh] min-h-[280px] max-h-[520px]">
                <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
                <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-4 z-10">
                    <BackToDashboardButton />
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Link
                            to="/traveler/destinations"
                            className="inline-flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur px-4 py-2.5 text-sm font-black text-slate-900 shadow-lg hover:bg-white"
                        >
                            <FaArrowLeft /> Explorer
                        </Link>
                        <Link
                            to="/destination"
                            className="inline-flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur border border-white/30 px-4 py-2.5 text-sm font-black text-white hover:bg-white/30"
                        >
                            <FaCompass /> Quick browse
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-6xl mx-auto z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur border border-white/35 text-white text-[10px] font-black uppercase tracking-widest">
                            <span aria-hidden>📍</span>
                            {dest.type}
                        </span>
                        {listed && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 border border-white/20 rounded-lg px-2 py-1">
                                Listed {listed}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{dest.name}</h1>
                    <p className="text-white/90 font-bold text-sm mt-3 flex items-center gap-2">
                        <span aria-hidden>🌡️</span> {dest.weather || 'Great time to visit'}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-20 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-10"
                >
                    <div className="flex items-start gap-3 mb-4">
                        <div className="mt-0.5 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <FaLightbulb />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Why this place</h2>
                            <p className="text-slate-600 font-medium leading-relaxed mt-2">{buildBlurb(dest)}</p>
                        </div>
                    </div>

                    <div className="mt-10 rounded-2xl bg-slate-50 border border-slate-100 p-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            Know before you go
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {tips.map((t) => (
                                <li key={t} className="flex gap-3 text-slate-700 font-semibold text-sm leading-snug">
                                    <span className="text-indigo-500 font-black shrink-0">✓</span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={toggleShortlist}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${
                                inShortlist
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-200'
                                    : 'bg-indigo-600 text-black hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                            }`}
                        >
                            {inShortlist ? (
                                <>
                                    <FaCheck /> In your shortlist
                                </>
                            ) : (
                                <>
                                    <FaPlus /> Add to trip shortlist
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={goPlan}
                            disabled={readSelected().length === 0}
                            className="flex-1 py-4 rounded-2xl font-black text-sm border-2 border-slate-200 text-slate-900 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continue to plan trip
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Link
                            to={`/packages?destination=${encodeURIComponent(dest.name)}`}
                            className="py-3.5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white font-black text-sm hover:opacity-95 transition-all text-center shadow-lg shadow-teal-200/50"
                        >
                            Tour packages
                        </Link>
                        <button
                            type="button"
                            onClick={() => navigate('/traveler/hotels')}
                            className="py-3.5 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-all"
                        >
                            Hotels
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/traveler/flights')}
                            className="py-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-sm hover:opacity-95 transition-all"
                        >
                            Flights
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/weather')}
                            className="py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 font-black text-sm hover:border-indigo-200 transition-all"
                        >
                            Weather
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TravelerDestinationDetailPage;
