import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const TravelerTransportPage = () => {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchTransports();
    }, []);

    const fetchTransports = async () => {
        try {
            const response = await api.get('/transport');
            setTransports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const filteredTransports = filter === 'All'
        ? transports
        : transports.filter(t => t.type === filter);

    const transportIcons = {
        'Bus': '🚌',
        'Train': '🚆',
        'Car Rental': '🚗',
        'Flights': '✈️',
        'All': '🗺️'
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <BackToDashboardButton />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter"
                    >
                        Smart <span className="text-indigo-600">Travel</span> Logistics
                    </motion.h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium">Your gateway to seamless inter-city connections.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {['All', 'Bus', 'Train', 'Car Rental'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${filter === tab
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-200'
                                }`}
                        >
                            <span className="text-lg">{transportIcons[tab]}</span>
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredTransports.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all group border border-slate-50 flex flex-col h-full"
                                >
                                    <div className="relative h-64">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800'}
                                            alt={item.provider}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-2xl text-sm font-black text-slate-900 shadow-sm border border-white">
                                            {transportIcons[item.type] || '🚗'} {item.type}
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.provider}</h2>
                                            <div className="flex items-center text-amber-500 font-bold ml-2">
                                                ★ <span className="text-slate-900 ml-1">{item.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl mb-8">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</p>
                                                <p className="text-sm font-bold text-slate-700">{item.from}</p>
                                            </div>
                                            <div className="flex-1 h-px bg-slate-200 relative">
                                                <div className="absolute inset-0 flex items-center justify-center -top-2">
                                                    <span className="text-xs">➡️</span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</p>
                                                <p className="text-sm font-bold text-slate-700">{item.to}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Starting at</p>
                                                <p className="text-2xl font-black text-indigo-600">PKR {item.price.toLocaleString()}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ x: 5 }}
                                                onClick={() => window.open(item.bookingUrl || 'https://www.traveler.com', '_blank')}
                                                className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase group/btn"
                                            >
                                                Book Now
                                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-colors">→</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerTransportPage;
