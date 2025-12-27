import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const TravelerHotelsPage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await api.get('/hotels');
            setHotels(response.data);
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

    const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <BackToDashboardButton />
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-extrabold tracking-tight"
                        >
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                Discover Luxury Stays
                            </span>
                        </motion.h1>
                        <p className="text-gray-600">Find and book the best hotels for your next adventure.</p>
                    </div>

                    <div className="relative max-w-sm w-full">
                        <input
                            type="text"
                            placeholder="Search hotels..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-indigo-100 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                            🔍
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-indigo-600 font-medium animate-pulse">Finding best hotels for you...</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredHotels.length > 0 ? (
                                filteredHotels.map((hotel, i) => (
                                    <motion.div
                                        key={hotel.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ y: -8 }}
                                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-gray-200/50"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            {hotel.image ? (
                                                <img
                                                    src={hotel.image}
                                                    alt={hotel.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-4xl">
                                                    🏨
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm">
                                                ★ {hotel.rating}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                                {hotel.name}
                                            </h3>

                                            <div className="flex items-center gap-1 mb-3">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <span key={idx} className={idx < hotel.stars ? "text-yellow-400" : "text-gray-200"}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {hotel.breakfast && (
                                                    <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-green-100">
                                                        🍳 Breakfast
                                                    </span>
                                                )}
                                                {hotel.wifi && (
                                                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-blue-100">
                                                        📶 Free WiFi
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-end justify-between mt-auto">
                                                <div>
                                                    <p className="text-gray-400 text-xs uppercase font-semibold">Per Night</p>
                                                    <p className="text-2xl font-black text-indigo-600">
                                                        PKR {hotel.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    onClick={() => handleBook(hotel.bookingUrl)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all flex items-center gap-2"
                                                >
                                                    Book now
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-900">No hotels found</h3>
                                    <p className="text-gray-500">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default TravelerHotelsPage;
