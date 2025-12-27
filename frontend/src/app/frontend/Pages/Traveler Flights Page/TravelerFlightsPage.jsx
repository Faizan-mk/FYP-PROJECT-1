import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const TravelerFlightsPage = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await api.get('/flights');
            setFlights(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleBook = (url) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Booking URL not available');
        }
    };

    const filteredFlights = flights.filter(f =>
        f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.to.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <BackToDashboardButton />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl font-black text-slate-900 tracking-tight"
                            >
                                Flying <span className="text-indigo-600">High?</span>
                            </motion.h1>
                            <p className="text-slate-500 mt-2 text-lg">Compare and book the best flight deals across the globe.</p>
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Where to?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-80 pl-12 pr-6 py-4 bg-white rounded-2xl border-none shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">✈️</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {filteredFlights.length > 0 ? (
                                filteredFlights.map((flight, i) => (
                                    <motion.div
                                        key={flight.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
                                    >
                                        <div className="flex items-center gap-4 min-w-[200px]">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors">
                                                {flight.logo || '✈️'}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{flight.airline}</h3>
                                                <div className="flex items-center gap-1 text-sm text-amber-500 font-bold">
                                                    ★ {flight.rating}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex items-center justify-between w-full">
                                            <div className="text-center md:text-left">
                                                <p className="text-3xl font-black text-slate-900 leading-none">{flight.departure}</p>
                                                <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{flight.from}</p>
                                            </div>

                                            <div className="flex-1 px-8 relative flex flex-col items-center">
                                                <p className="text-xs font-bold text-slate-400 absolute -top-1 uppercase tracking-tighter">
                                                    {flight.duration}
                                                </p>
                                                <div className="w-full h-[2px] bg-slate-100 relative">
                                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-slate-200 bg-white"></div>
                                                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-slate-200 bg-white"></div>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-200">✈️</div>
                                                </div>
                                                <p className="text-[10px] font-bold text-indigo-500 mt-2 uppercase">Direct Flight</p>
                                            </div>

                                            <div className="text-center md:text-right">
                                                <p className="text-3xl font-black text-slate-900 leading-none">{flight.arrival}</p>
                                                <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{flight.to}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 min-w-[180px] border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:pl-8">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase">Avg Price</p>
                                                <p className="text-2xl font-black text-indigo-600">PKR {flight.price.toLocaleString()}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleBook(flight.bookingUrl)}
                                                className="w-full bg-slate-900 text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-colors"
                                            >
                                                Book This Flight
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic text-lg opacity-50">No flights matching your sky-map...</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerFlightsPage;
