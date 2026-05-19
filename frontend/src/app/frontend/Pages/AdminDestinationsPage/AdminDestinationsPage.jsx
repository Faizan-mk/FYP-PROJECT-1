import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { destinationService } from '../../src/services/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const AdminDestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'City',
        weather: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const types = ['Beach', 'Mountain', 'City', 'Desert', 'Culture', 'Adventure'];

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const data = await destinationService.getAllDestinations();
            setDestinations(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDestination) {
                await destinationService.updateDestination(editingDestination.id, formData);
            } else {
                await destinationService.createDestination(formData);
            }
            fetchDestinations();
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error saving destination:', error);
            alert('Error saving destination. Please make sure you are logged in as admin.');
        }
    };

    const handleEdit = (dest) => {
        setEditingDestination(dest);
        setFormData({
            name: dest.name,
            type: dest.type,
            weather: dest.weather,
            image: dest.image || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
            try {
                await destinationService.deleteDestination(id);
                fetchDestinations();
            } catch (error) {
                console.error('Error deleting destination:', error);
                alert('Error deleting destination.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'City',
            weather: '',
            image: ''
        });
        setEditingDestination(null);
    };

    const filteredDestinations = destinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div>
                        <BackToDashboardButton />
                        <h1 className="text-4xl font-black text-slate-900 mt-2">Destination Registry</h1>
                        <p className="text-slate-500 font-medium">Curate the list of eligible travel spots for your users.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search spots..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="bg-indigo-600 text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-slate-900 transition-all font-bold"
                        >
                            <span>📍</span> Add Spot
                        </motion.button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((dest, idx) => (
                                <motion.div
                                    key={dest.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-slate-100 hover:border-indigo-100 hover:shadow-2xl transition-all group relative"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={dest.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600'}
                                            alt={dest.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                            <button onClick={() => handleEdit(dest)} className="w-10 h-10 flex items-center justify-center bg-white shadow-xl rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">✏️</button>
                                            <button onClick={() => handleDelete(dest.id)} className="w-10 h-10 flex items-center justify-center bg-white shadow-xl rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">🗑️</button>
                                        </div>

                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-lg border border-indigo-400/30 backdrop-blur-sm">
                                                {dest.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{dest.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                <span className="text-lg">🌡️</span>
                                                <span className="text-slate-600 text-xs font-black tracking-tight">{dest.weather || 'Seasonal'}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-indigo-200 transition-colors">
                                                <span className="text-indigo-400 text-xs text-[10px] font-black group-hover:scale-110 transition-transform">GO</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold italic">No destinations registered. Click "Add Spot" to begin.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h2 className="text-2xl font-black text-slate-900 italic">
                                    {editingDestination ? 'Modify Spot' : 'Register Spot'}
                                </h2>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 transition-all font-bold">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spot Identity</label>
                                        <div className="relative group">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">📍</span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                                                placeholder="e.g. Hunza Valley"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">📂</span>
                                                <select
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-10 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none appearance-none cursor-pointer"
                                                >
                                                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">▼</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Climate</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🌡️</span>
                                                <input
                                                    type="text"
                                                    name="weather"
                                                    value={formData.weather}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                                                    placeholder="25°C • Sunny"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset (URL)</label>
                                        <div className="relative group">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🖼️</span>
                                            <input
                                                type="url"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium outline-none"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-5 rounded-2xl bg-slate-100 text-black font-bold hover:bg-slate-200 transition-all uppercase tracking-widest"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 rounded-2xl bg-indigo-600 text-black font-black text-lg shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all uppercase tracking-widest hover:-translate-y-1 active:scale-95"
                                    >
                                        {editingDestination ? 'Update Spot' : 'Publish Spot'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDestinationsPage;
