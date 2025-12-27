import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const AdminTransportPage = () => {
    const [transports, setTransports] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTransport, setEditingTransport] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Bus',
        provider: '',
        price: '',
        duration: '',
        from: '',
        to: '',
        bookingUrl: '',
        rating: 4.0,
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTransports();
    }, []);

    const fetchTransports = async () => {
        try {
            const response = await api.get('/transport');
            setTransports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transport:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTransport) {
                await api.put(`/transport/${editingTransport.id}`, formData);
            } else {
                await api.post('/transport', formData);
            }
            fetchTransports();
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error saving transport:', error);
            alert('Error saving transport. Please make sure you are logged in as admin.');
        }
    };

    const handleEdit = (transport) => {
        setEditingTransport(transport);
        setFormData(transport);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transport?')) {
            try {
                await api.delete(`/transport/${id}`);
                fetchTransports();
            } catch (error) {
                console.error('Error deleting transport:', error);
                alert('Error deleting transport.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'Bus',
            provider: '',
            price: '',
            duration: '',
            from: '',
            to: '',
            bookingUrl: '',
            rating: 4.0,
            image: ''
        });
        setEditingTransport(null);
    };

    const filteredTransports = transports.filter(t =>
        t.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.to.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const typeIcons = {
        'Bus': '🚌',
        'Train': '🚆',
        'Car Rental': '🚗',
        'Taxi': '🚕',
        'Bike': '🚲'
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                    <div className="flex-1">
                        <BackToDashboardButton />
                        <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tighter">Transport Network</h1>
                        <p className="text-slate-500 font-medium">Coordinate inter-city logistics and provider connections.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search providers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-[1.5rem] border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold placeholder:text-slate-300"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
                        >
                            <span>➕</span> Add Service
                        </motion.button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredTransports.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all group flex flex-col"
                            >
                                <div className="relative h-56 bg-slate-100 overflow-hidden">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600'}
                                        alt={item.provider}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-2xl text-xs font-black text-slate-900 shadow-sm">
                                        {typeIcons[item.type] || '🚗'} {item.type}
                                    </div>
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all">✏️</button>
                                        <button onClick={() => handleDelete(item.id)} className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{item.provider}</h3>
                                        <div className="flex items-center text-amber-500 font-bold">
                                            ★ <span className="text-slate-900 ml-1 text-sm">{item.rating}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                            <span>{item.from}</span>
                                            <span className="flex-1 h-px bg-slate-100"></span>
                                            <span>{item.to}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-black text-slate-600">
                                            <span className="flex items-center gap-1">⏱️ {item.duration}</span>
                                            <span className="text-indigo-600 text-lg">PKR {item.price?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <a href={item.bookingUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-300 hover:text-indigo-600 transition-colors uppercase tracking-widest leading-none">Booking Source ↗</a>
                                    </div>
                                </div>
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
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
                                <h2 className="text-3xl font-black text-slate-900">
                                    {editingTransport ? 'Update Dispatch' : 'New Dispatch'}
                                </h2>
                                <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transportation Type</label>
                                        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-bold outline-none appearance-none">
                                            <option value="Bus">Bus Service</option>
                                            <option value="Train">Railway</option>
                                            <option value="Car Rental">Car Rental</option>
                                            <option value="Taxi">Private Taxi</option>
                                            <option value="Bike">Bike/Scooter</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operator/Provider</label>
                                        <input type="text" name="provider" value={formData.provider} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin City</label>
                                        <input type="text" name="from" value={formData.from} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination City</label>
                                        <input type="text" name="to" value={formData.to} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fare (PKR)</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Travel Duration</label>
                                        <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 5h 20m" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Image (URL)</label>
                                        <input type="url" name="image" value={formData.image} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="https://..." />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">External Booking Source</label>
                                        <input type="url" name="bookingUrl" value={formData.bookingUrl} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="https://..." />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all uppercase tracking-widest"
                                >
                                    {editingTransport ? 'Update Dispatch' : 'Confirm dispatch'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTransportPage;
