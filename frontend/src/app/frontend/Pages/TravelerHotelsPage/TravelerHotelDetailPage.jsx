import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaWifi, FaCoffee, FaParking, FaConciergeBell } from 'react-icons/fa';
import { hotelService } from '../../src/services/api';
import { parseHotelMeta } from './hotelMeta';

const FALLBACK =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200';

const HOTEL_DETAIL_REFRESH_MS = 30000;

const TravelerHotelDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hero, setHero] = useState(FALLBACK);

    useEffect(() => {
        let cancelled = false;

        const load = async (silent) => {
            if (!silent) {
                setError('');
                setLoading(true);
            }
            try {
                const data = await hotelService.getLiveHotelById(id);
                if (cancelled) return;
                setHotel(data);
                const meta = parseHotelMeta(data);
                setHero((prev) => {
                    const candidates = [data.image, ...meta.gallery].filter(Boolean);
                    return candidates.includes(prev)
                        ? prev
                        : data.image || meta.gallery[0] || FALLBACK;
                });
            } catch (e) {
                if (!cancelled) {
                    setError(e?.message || 'Hotel not found.');
                    setHotel(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (!id) return undefined;
        load(false);
        const intervalId = setInterval(() => load(true), HOTEL_DETAIL_REFRESH_MS);
        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!hotel || error) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8">
                <p className="text-red-600 font-bold mb-4">{error || 'Not found'}</p>
                <button
                    type="button"
                    onClick={() => navigate('/traveler/hotels')}
                    className="text-indigo-600 font-bold underline"
                >
                    Back to hotels
                </button>
            </div>
        );
    }

    const meta = parseHotelMeta(hotel);
    const thumbs = [hotel.image, ...meta.gallery].filter((u, i, a) => u && a.indexOf(u) === i);

    return (
        <div className="min-h-screen bg-[#fafafa] pb-16">
            <div className="relative h-[45vh] min-h-[280px] max-h-[520px]">
                <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 max-w-6xl mx-auto flex justify-between items-start">
                    <button
                        type="button"
                        onClick={() => navigate('/traveler/hotels')}
                        className="flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur px-4 py-2.5 text-sm font-black text-slate-800 shadow-lg hover:bg-white"
                    >
                        <FaArrowLeft /> All hotels
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-6xl mx-auto">
                    <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2">{meta.city}</p>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{hotel.name}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-white">
                        <span className="flex items-center gap-1 text-amber-300 font-black">
                            <FaStar /> {Number(hotel.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-white/70 font-semibold">{hotel.stars}-star property</span>
                        {hotel.breakfast && (
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Breakfast</span>
                        )}
                        {hotel.wifi && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                                <FaWifi /> Wi‑Fi
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-10"
                >
                    {thumbs.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100">
                            {thumbs.map((url) => (
                                <button
                                    key={url}
                                    type="button"
                                    onClick={() => setHero(url)}
                                    className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden ring-2 transition ${hero === url ? 'ring-indigo-600' : 'ring-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-black text-slate-900">About this property</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">{meta.description}</p>

                            <h3 className="text-lg font-black text-slate-900 pt-4">Services & amenities</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {meta.services.map((s) => (
                                    <li
                                        key={s}
                                        className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
                                    >
                                        <span className="text-indigo-600">
                                            {s.toLowerCase().includes('wifi') ? <FaWifi /> : s.toLowerCase().includes('park') ? <FaParking /> : s.toLowerCase().includes('desk') || s.toLowerCase().includes('concierge') ? <FaConciergeBell /> : s.toLowerCase().includes('breakfast') || s.toLowerCase().includes('coffee') ? <FaCoffee /> : '✓'}
                                        </span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-3xl bg-slate-900 text-white p-8 shadow-2xl">
                                {hotel.isLive && (
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-2">
                                        Live
                                    </p>
                                )}
                                <p className="text-xs font-black uppercase tracking-widest text-white/50">From</p>
                                <p className="text-4xl font-black text-white mt-1">
                                    Rs. {Number(hotel.price || 0).toLocaleString()}
                                    <span className="text-base font-bold text-white/60"> / night</span>
                                </p>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-xs font-black uppercase tracking-widest text-white/50">Rooms available</p>
                                    <p className="text-5xl font-black text-indigo-300 mt-2">{meta.roomsAvailable}</p>
                                    <p className="text-sm text-white/60 mt-1">Approximate inventory for online booking</p>
                                </div>

                                <a
                                    href={hotel.bookingUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-8 block w-full text-center rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-blue font-black py-4 transition"
                                >
                                    Book now
                                </a>
                                <p className="text-xs text-white/40 text-center mt-4">You will complete payment on the partner website.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TravelerHotelDetailPage;
