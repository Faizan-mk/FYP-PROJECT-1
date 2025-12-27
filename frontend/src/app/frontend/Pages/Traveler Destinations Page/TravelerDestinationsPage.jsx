import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { destinationService } from '../../src/services/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const TravelerDestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [addedDestinations, setAddedDestinations] = useState(() => {
        const saved = localStorage.getItem('selectedDestinations');
        return saved ? JSON.parse(saved) : [];
    });

    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Traveler';

    const filters = ['All', 'Beach', 'Mountain', 'City', 'Desert', 'Culture', 'Adventure'];

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await destinationService.getAllDestinations();
                setDestinations(data || []);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const filteredDestinations = useMemo(() => {
        return destinations.filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || d.type === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [destinations, searchQuery, activeFilter]);

    const handleToggleDestination = (dest) => {
        setAddedDestinations(prev => {
            const isAdded = prev.find(item => item.id === dest.id);
            let newList;
            if (isAdded) {
                newList = prev.filter(item => item.id !== dest.id);
            } else {
                newList = [...prev, dest];
            }
            localStorage.setItem('selectedDestinations', JSON.stringify(newList));
            return newList;
        });
    };

    const isDestAdded = (id) => addedDestinations.some(d => d.id === id);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <BackToDashboardButton />
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl font-black text-slate-900 tracking-tight leading-tight mt-6"
                            >
                                Discover <span className="text-indigo-600">Paradise.</span>
                            </motion.h1>
                            <p className="text-slate-500 text-xl font-medium mt-4">
                                Hey {userName}, explore hand-picked spots curated just for your next big adventure.
                            </p>
                        </div>

                        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-2 ring-1 ring-slate-100">
                            <div className="relative group flex-1 min-w-[300px]">
                                <input
                                    type="text"
                                    placeholder="Search by name or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-transparent rounded-2xl border-none focus:ring-0 outline-none font-bold text-slate-700"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🔍</span>
                            </div>
                            <button
                                onClick={() => navigate('/create-trip', { state: { destinations: addedDestinations } })}
                                disabled={addedDestinations.length === 0}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                Plan Trip ({addedDestinations.length})
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-12 flex flex-wrap gap-3">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-2.5 rounded-full text-sm font-black transition-all ${activeFilter === f
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'bg-white text-slate-500 hover:bg-slate-200 ring-1 ring-slate-200 shadow-sm'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold italic">Loading hidden gems...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        <AnimatePresence>
                            {filteredDestinations.length > 0 ? (
                                filteredDestinations.map((dest, i) => (
                                    <motion.div
                                        key={dest.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex flex-col group"
                                    >
                                        <div className="relative aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-100 transition-all duration-700">
                                            <img
                                                src={dest.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600'}
                                                alt={dest.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                            <div className="absolute top-6 right-6">
                                                <button
                                                    onClick={() => handleToggleDestination(dest)}
                                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all ${isDestAdded(dest.id)
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 rotate-[360deg]'
                                                            : 'bg-white/90 text-slate-900 hover:bg-white hover:scale-110'
                                                        }`}
                                                >
                                                    {isDestAdded(dest.id) ? '✓' : '＋'}
                                                </button>
                                            </div>

                                            <div className="absolute bottom-8 left-8 right-8">
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-widest border border-white/30">
                                                    {dest.type}
                                                </span>
                                                <h3 className="text-2xl font-black text-white mt-3 leading-tight group-hover:translate-x-2 transition-transform duration-500">
                                                    {dest.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2 text-white/70 text-sm font-bold">
                                                    <span>🌡️</span> {dest.weather || 'Perfect Weather'}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-40 text-center">
                                    <div className="text-9xl mb-8 opacity-10 grayscale">🏝️</div>
                                    <h3 className="text-4xl font-black text-slate-900 mb-2">No Island Found</h3>
                                    <p className="text-slate-400 text-xl font-medium max-w-md mx-auto">
                                        Our scouts are still exploring this category. Try searching for something else!
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Added Drawer Helper */}
            {addedDestinations.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40"
                >
                    <div className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-6 border-4 border-indigo-600">
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Ready to Roll?</p>
                            <p className="text-lg font-black truncate max-w-[200px]">
                                {addedDestinations.length} Spot{addedDestinations.length > 1 ? 's' : ''} Selected
                            </p>
                        </div>
                        <div className="h-8 w-px bg-white/20"></div>
                        <button
                            onClick={() => navigate('/create-trip', { state: { destinations: addedDestinations } })}
                            className="bg-indigo-600 hover:bg-white hover:text-indigo-600 px-6 py-2.5 rounded-xl font-black transition-all active:scale-95"
                        >
                            Start Planning
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TravelerDestinationsPage;
