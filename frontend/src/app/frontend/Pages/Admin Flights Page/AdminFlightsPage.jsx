import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const AdminFlightsPage = () => {
    const [flights, setFlights] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    const [formData, setFormData] = useState({
        airline: '',
        logo: '✈️',
        price: '',
        duration: '',
        departure: '',
        arrival: '',
        from: '',
        to: '',
        bookingUrl: '',
        rating: 4.0
    });
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
            console.error('Error fetching flights:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFlight) {
                await api.put(`/flights/${editingFlight.id}`, formData);
            } else {
                await api.post('/flights', formData);
            }
            fetchFlights();
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error saving flight:', error);
            alert('Error saving flight. Please make sure you are logged in as admin.');
        }
    };

    const handleEdit = (flight) => {
        setEditingFlight(flight);
        setFormData(flight);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                await api.delete(`/flights/${id}`);
                fetchFlights();
            } catch (error) {
                console.error('Error deleting flight:', error);
                alert('Error deleting flight. Please make sure you are logged in as admin.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            airline: '',
            logo: '✈️',
            price: '',
            duration: '',
            departure: '',
            arrival: '',
            from: '',
            to: '',
            bookingUrl: '',
            rating: 4.0
        });
        setEditingFlight(null);
    };

    const filteredFlights = flights.filter(f =>
        f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.to.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <BackToDashboardButton />
                        <h1 className="text-4xl font-black text-slate-900 mt-2">Flight Fleet</h1>
                        <p className="text-slate-500 font-medium">Control and monitor your airline schedules globally.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Filter schedules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                        >
                            <span>➕</span> Add New Flight
                        </motion.button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFlights.map((flight, idx) => (
                            <motion.div
                                key={flight.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{flight.logo || '✈️'}</div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-800">{flight.airline}</h3>
                                                <div className="text-amber-500 font-bold text-sm">★ {flight.rating}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(flight)}
                                                className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(flight.id)}
                                                className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-8 px-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-slate-900 leading-none">{flight.from}</div>
                                            <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{flight.departure}</div>
                                        </div>
                                        <div className="flex-1 px-4 relative">
                                            <div className="h-px bg-slate-200 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 bg-white px-2">
                                                    {flight.duration}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-slate-900 leading-none">{flight.to}</div>
                                            <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{flight.arrival}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between pt-6 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Avg Ticket Price</p>
                                            <p className="text-2xl font-black text-indigo-600">PKR {flight.price.toLocaleString()}</p>
                                        </div>
                                        <a
                                            href={flight.bookingUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            🔗 Link
                                        </a>
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
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                    {editingFlight ? 'Edit Flight Schedule' : 'Launch New Schedule'}
                                </h2>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 text-2xl font-light">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8 scrollbar-thin">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Airline Name</label>
                                        <input
                                            type="text"
                                            name="airline"
                                            value={formData.airline}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Logo Icon</label>
                                        <input
                                            type="text"
                                            name="logo"
                                            value={formData.logo}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-center text-2xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Origin (Code)</label>
                                        <input
                                            type="text"
                                            name="from"
                                            value={formData.from}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold uppercase"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destination (Code)</label>
                                        <input
                                            type="text"
                                            name="to"
                                            value={formData.to}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold uppercase"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Departure</label>
                                        <input
                                            type="text"
                                            name="departure"
                                            value={formData.departure}
                                            onChange={handleInputChange}
                                            placeholder="08:00 AM"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Arrival</label>
                                        <input
                                            type="text"
                                            name="arrival"
                                            value={formData.arrival}
                                            onChange={handleInputChange}
                                            placeholder="11:30 AM"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            placeholder="2h 30m"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (PKR)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all"
                                    >
                                        {editingFlight ? 'Update Schedule' : 'Confirm Launch'}
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

export default AdminFlightsPage;
