import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const REFRESH_INTERVAL = 60;

const AIRLINE_META = {
    PK: { name: 'PIA', fullName: 'Pakistan International Airlines', logo: '🇵🇰', color: '#059669' },
    PA: { name: 'Airblue', fullName: 'Airblue', logo: '🏙️', color: '#2563eb' },
    ER: { name: 'SereneAir', fullName: 'SereneAir', logo: '💎', color: '#7c3aed' },
    PF: { name: 'AirSial', fullName: 'AirSial', logo: '🏗️', color: '#f59e0b' },
    FJ: { name: 'Fly Jinnah', fullName: 'Fly Jinnah', logo: '🔴', color: '#ef4444' },
};

const PAKISTAN_CITIES = [
    'Karachi (KHI)', 'Lahore (LHE)', 'Islamabad (ISB)', 'Peshawar (PEW)',
    'Quetta (UET)', 'Multan (MUX)', 'Sialkot (SKT)', 'Faisalabad (LYP)',
];

const FlightSearchPage = () => {
    const { airlineCode } = useParams();
    const navigate = useNavigate();
    const code = airlineCode?.toUpperCase();
    const meta = AIRLINE_META[code] || { name: airlineCode, fullName: airlineCode, logo: '✈️', color: '#3b82f6' };

    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState({ from: '', to: '', date: today, passengers: 1 });
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
    const [lastUpdated, setLastUpdated] = useState(null);

    const formRef = useRef(form);
    useEffect(() => { formRef.current = form; }, [form]);

    const fetchFlights = useCallback(async (params, silent = false) => {
        if (silent) setRefreshing(true); else setLoading(true);
        try {
            const query = new URLSearchParams({
                airlineCode: code,
                from: params.from || '',
                to: params.to || '',
                date: params.date || today,
                passengers: params.passengers || 1,
            }).toString();

            const res = await fetch(`${API_BASE}/api/pak-flights/search?${query}`);
            const data = await res.json();
            setFlights(data.flights || []);
            setLastUpdated(new Date());
            setCountdown(REFRESH_INTERVAL);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false); setRefreshing(false);
        }
    }, [code, today]);

    useEffect(() => { fetchFlights(formRef.current); }, [code, fetchFlights]);

    useEffect(() => {
        const interval = setInterval(() => fetchFlights(formRef.current, true), REFRESH_INTERVAL * 1000);
        return () => clearInterval(interval);
    }, [fetchFlights]);

    useEffect(() => {
        const tick = setInterval(() => setCountdown(p => (p <= 1 ? REFRESH_INTERVAL : p - 1)), 1000);
        return () => clearInterval(tick);
    }, []);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSearch = (e) => { e.preventDefault(); fetchFlights(form); };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* ── SIMPLE HEADER ── */}
            <header className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/flights')}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors group"
                        >
                            <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors text-base">←</span>
                            All
                        </button>
                        <div className="h-6 w-px bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shadow-sm">
                                {meta.logo}
                            </div>
                            <h1 className="text-base font-bold text-slate-900 leading-none">{meta.name}</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── AIRLINE TITLE SECTION ── */}
            <div className="bg-white border-b border-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight mb-2">
                            {meta.fullName}
                        </h2>
                        <div className="h-1.5 w-20 mx-auto rounded-full mt-4" style={{ backgroundColor: meta.color }}></div>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Modern Search High-Contrast Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-200 flex flex-col lg:flex-row gap-4 items-center mb-16"
                >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {/* SELECT BOXES */}
                        <div className="flex flex-col gap-1 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-blue-300 transition-all">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Origin</label>
                            <select name="from" value={form.from} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 outline-none w-full cursor-pointer">
                                <option value="">Departure City</option>
                                {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-blue-300 transition-all">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Destination</label>
                            <select name="to" value={form.to} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 outline-none w-full cursor-pointer">
                                <option value="">Arrival City</option>
                                {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-blue-300 transition-all">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Date</label>
                            <input type="date" name="date" min={today} value={form.date} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 outline-none w-full cursor-pointer" />
                        </div>

                        <div className="flex flex-col gap-1 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-blue-300 transition-all">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Travelers</label>
                            <select name="passengers" value={form.passengers} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 outline-none w-full cursor-pointer">
                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Person{n > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.preventDefault(); fetchFlights(form); }}
                        className="w-full lg:w-auto px-12 py-5 rounded-[1.8rem] font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                        style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search Flights →'}
                    </button>
                </motion.div>

                {/* Results Canvas */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">✈</span>
                        {flights.length > 0 ? `${flights.length} Scheduled Flights Found` : 'Flight Results'}
                    </h2>
                    {lastUpdated && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {refreshing ? 'Syncing...' : `Last Sync: ${lastUpdated.toLocaleTimeString()}`}
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-200" />
                            ))}
                        </div>
                    ) : flights.length > 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-8">
                            {flights.map((f, i) => (
                                <motion.div
                                    key={f.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="flex flex-col lg:flex-row items-center gap-10">
                                        {/* Brand Section */}
                                        <div className="flex flex-row lg:flex-col items-center gap-4 lg:min-w-[150px] lg:border-r border-slate-100 lg:pr-10">
                                            <div
                                                className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-5xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500"
                                                style={{ borderBottom: `4px solid ${meta.color}` }}
                                            >
                                                {meta.logo}
                                            </div>
                                            <div className="text-left lg:text-center mt-2">
                                                <p className="text-xl font-black text-slate-900 leading-none">{meta.name}</p>
                                                <div className="flex items-center gap-1.5 mt-2 lg:justify-center">
                                                    <span className={`w-2 h-2 rounded-full ${f.statusColor === 'red' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.status || 'Verified'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flight Track */}
                                        <div className="flex-1 flex items-center justify-between w-full px-4 gap-4 md:gap-12">
                                            <div className="text-center md:text-left">
                                                <p className="text-4xl font-black text-slate-900 tracking-tighter">{f.departure_time}</p>
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3">From</p>
                                                <p className="text-slate-400 text-sm font-bold uppercase">{f.from_airport?.split(' ')[0]}</p>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center gap-3 relative">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{f.duration}</p>
                                                <div className="w-full h-0.5 bg-slate-100 relative group-hover:bg-blue-100 transition-colors">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:rotate-12 group-hover:scale-110">✈</div>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{f.stops === 0 ? 'Direct Flight' : `${f.stops} Stop(s)`}</p>
                                            </div>

                                            <div className="text-center md:text-right">
                                                <p className="text-4xl font-black text-slate-900 tracking-tighter">{f.arrival_time}</p>
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3">To</p>
                                                <p className="text-slate-400 text-sm font-bold uppercase">{f.to_airport?.split(' ')[0]}</p>
                                            </div>
                                        </div>

                                        {/* Action/Price Section */}
                                        <div className="lg:border-l border-slate-100 lg:pl-10 w-full lg:w-auto flex flex-col items-center lg:items-end gap-4 min-w-[220px]">
                                            <div className="text-center lg:text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Ticket Fare</p>
                                                <div className="flex items-baseline justify-center lg:justify-end gap-1">
                                                    <span className="text-sm font-black text-slate-400">PKR</span>
                                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{Number(f.price).toLocaleString()}</span>
                                                </div>
                                                {f.seatsUrgent && (
                                                    <div className="mt-3 bg-red-50 text-red-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block animate-bounce border border-red-100">
                                                        🔥 Last {f.seatsLeft} Seats Left
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => window.open(`${API_BASE}${f.redirect_url}`, '_blank')}
                                                className="w-full px-8 py-5 rounded-2xl font-black transition-all active:scale-95 text-sm uppercase tracking-widest"
                                                style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                                            >
                                                Select Ticket →
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-48 text-center bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                            <span className="text-9xl opacity-20 block mb-6 grayscale">🌎</span>
                            <h3 className="text-4xl font-black text-slate-900 mb-2">No Flights Detected</h3>
                            <p className="text-slate-500 text-xl font-medium max-w-sm mx-auto">We couldn't locate any live flights for this connection. Please try an alternative date or city pair.</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>

        </div>
    );
};

export default FlightSearchPage;
