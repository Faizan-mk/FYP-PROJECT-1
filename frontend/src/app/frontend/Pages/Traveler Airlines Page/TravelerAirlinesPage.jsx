import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const TravelerAirlinesPage = () => {
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAirlines();
    }, []);

    const fetchAirlines = async () => {
        try {
            const response = await api.get('/airlines');
            setAirlines(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleVisit = (url) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Website URL not available');
        }
    };

    const filteredAirlines = airlines.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="max-w-xl">
                        <BackToDashboardButton />
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-black text-slate-900 tracking-tight leading-tight mt-4"
                        >
                            Global <span className="text-indigo-600 italic">Partners.</span>
                        </motion.h1>
                        <p className="text-slate-500 text-xl font-medium mt-4">We collaborate with the world's most trusted airlines to ensure your journey is seamless.</p>
                    </div>
                    <div className="w-full md:w-96">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search by airline or country..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-700"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-600 transition-colors">🔍</div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        <AnimatePresence>
                            {filteredAirlines.length > 0 ? (
                                filteredAirlines.map((airline, i) => (
                                    <motion.div
                                        key={airline.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex flex-col group"
                                    >
                                        <div className="relative aspect-video bg-slate-50 rounded-[2rem] overflow-hidden mb-6 group-hover:shadow-2xl group-hover:shadow-indigo-100 transition-all duration-500">
                                            <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-125 transition-transform duration-500 grayscale group-hover:grayscale-0 opacity-20 group-hover:opacity-100">
                                                {airline.logo || '🛫'}
                                            </div>
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-black text-slate-900 shadow-sm border border-slate-100">
                                                ★ {airline.rating}
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {airline.name}
                                                </h3>
                                                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                                                    {airline.country}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-6">
                                                {airline.description}
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleVisit(airline.websiteUrl)}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm group-hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                                            >
                                                <span>Visit Website</span>
                                                <span className="text-lg opacity-50">↗</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-40 text-center">
                                    <div className="text-8xl mb-8 opacity-20">☁️</div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">Airline Not Found</h3>
                                    <p className="text-slate-500 font-medium">Try searching for a different carrier or country.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerAirlinesPage;
