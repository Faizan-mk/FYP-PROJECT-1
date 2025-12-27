import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const AdminAirlinesPage = () => {
    const [airlines, setAirlines] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAirline, setEditingAirline] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '✈️',
        description: '',
        country: '',
        rating: 4.0,
        websiteUrl: ''
    });
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
            console.error('Error fetching airlines:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAirline) {
                await api.put(`/airlines/${editingAirline.id}`, formData);
            } else {
                await api.post('/airlines', formData);
            }
            fetchAirlines();
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error saving airline:', error);
            alert('Error saving airline. Please make sure you are logged in as admin.');
        }
    };

    const handleEdit = (airline) => {
        setEditingAirline(airline);
        setFormData(airline);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this airline?')) {
            try {
                await api.delete(`/airlines/${id}`);
                fetchAirlines();
            } catch (error) {
                console.error('Error deleting airline:', error);
                alert('Error deleting airline. Please make sure you are logged in as admin.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            logo: '✈️',
            description: '',
            country: '',
            rating: 4.0,
            websiteUrl: ''
        });
        setEditingAirline(null);
    };

    const filteredAirlines = airlines.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div>
                        <BackToDashboardButton />
                        <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">Airline Directory</h1>
                        <p className="text-slate-500 font-medium">Manage airline profiles and partnership details.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search directory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
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
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                        >
                            <span>🏢</span> Register Airline
                        </motion.button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredAirlines.map((airline, idx) => (
                            <motion.div
                                key={airline.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl group-hover:bg-indigo-50 transition-colors">
                                        {airline.logo || '🛫'}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(airline)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">✏️</button>
                                        <button onClick={() => handleDelete(airline.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-1">{airline.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs font-black px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase tracking-widest">{airline.country}</span>
                                    <span className="text-amber-500 font-bold text-sm">★ {airline.rating}</span>
                                </div>

                                <p className="text-slate-400 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                                    {airline.description}
                                </p>

                                <a
                                    href={airline.websiteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
                                >
                                    Official Website ↗
                                </a>
                            </motion.div>
                        ))}
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
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h2 className="text-3xl font-black text-slate-900 italic">
                                    {editingAirline ? 'Modify Identity' : 'Register Brand'}
                                </h2>
                                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Airline Identity</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Symbol (Emoji)</label>
                                        <input type="text" name="logo" value={formData.logo} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-center text-2xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Headquarters</label>
                                        <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quality Rating (0-5)</label>
                                        <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="0" max="5" step="0.1" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Brand Story</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Digital Presence (URL)</label>
                                        <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold" placeholder="https://..." />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-600 transition-all"
                                >
                                    {editingAirline ? 'Apply Changes' : 'Confirm Registration'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminAirlinesPage;
