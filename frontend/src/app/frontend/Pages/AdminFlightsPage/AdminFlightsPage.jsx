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
                            className="bg-indigo-600 text-black px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
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
                                className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/20 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">{flight.logo || '✈️'}</div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{flight.airline}</h3>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-amber-500 font-black mr-1">★</span>
                                                    <span className="text-slate-500 font-bold text-xs tracking-tight">{flight.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(flight)}
                                                className="p-3 bg-slate-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm transform hover:scale-110 active:scale-90"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(flight.id)}
                                                className="p-3 bg-slate-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm transform hover:scale-110 active:scale-90"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-10 px-2 bg-slate-50/50 py-6 rounded-3xl border border-slate-100">
                                        <div className="text-center flex-1">
                                            <div className="text-3xl font-black text-slate-900 tracking-tighter">{flight.from}</div>
                                            <div className="text-[10px] font-black text-indigo-500 mt-2 uppercase tracking-widest bg-indigo-50 py-1 px-2 rounded-lg inline-block whitespace-nowrap">{flight.departure}</div>
                                        </div>

                                        <div className="flex-[0.5] flex flex-col items-center">
                                            <div className="w-full h-px bg-slate-200 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 bg-white border border-slate-100 px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                                    {flight.duration}
                                                </div>
                                            </div>
                                            <span className="text-indigo-400 mt-4 text-sm animate-pulse">✈</span>
                                        </div>

                                        <div className="text-center flex-1">
                                            <div className="text-3xl font-black text-slate-900 tracking-tighter">{flight.to}</div>
                                            <div className="text-[10px] font-black text-emerald-500 mt-2 uppercase tracking-widest bg-emerald-50 py-1 px-2 rounded-lg inline-block whitespace-nowrap">{flight.arrival}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t-2 border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Economy</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-bold text-slate-400 italic">PKR</span>
                                                <p className="text-3xl font-black text-indigo-700">{flight.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={flight.bookingUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all rounded-2xl shadow-sm group/link"
                                        >
                                            <span className="group-hover/link:scale-125 transition-transform">↗</span>
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

                            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 scrollbar-thin max-h-[75vh]">
                                {/* Section: Airline & Route */}
                                <div>
                                    <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Airline & Route
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Airline Name</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">✈️</span>
                                                <input
                                                    type="text"
                                                    name="airline"
                                                    value={formData.airline}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                                                    placeholder="e.g. Emirates"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Logo Icon</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🎨</span>
                                                <input
                                                    type="text"
                                                    name="logo"
                                                    value={formData.logo}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-center text-2xl outline-none"
                                                    placeholder="✈️"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Origin (IATA)</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🛫</span>
                                                <input
                                                    type="text"
                                                    name="from"
                                                    value={formData.from}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold uppercase outline-none"
                                                    placeholder="DXB"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destination (IATA)</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🛬</span>
                                                <input
                                                    type="text"
                                                    name="to"
                                                    value={formData.to}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold uppercase outline-none"
                                                    placeholder="LHR"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Logistics & Pricing */}
                                <div>
                                    <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Logistics & Pricing
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Departure Time</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🕒</span>
                                                <input
                                                    type="text"
                                                    name="departure"
                                                    value={formData.departure}
                                                    onChange={handleInputChange}
                                                    placeholder="08:00 AM"
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Time</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🕤</span>
                                                <input
                                                    type="text"
                                                    name="arrival"
                                                    value={formData.arrival}
                                                    onChange={handleInputChange}
                                                    placeholder="11:30 AM"
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Flight Duration</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">⏳</span>
                                                <input
                                                    type="text"
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                    placeholder="2h 30m"
                                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ticket Price (PKR)</label>
                                            <div className="relative group">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors font-black text-[10px]">PKR</span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-16 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-indigo-600 outline-none"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-5 rounded-2xl bg-slate-100 text-black font-bold hover:bg-slate-200 transition-all uppercase tracking-widest"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 rounded-2xl bg-indigo-600 text-black font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all uppercase tracking-widest hover:-translate-y-1 active:scale-95"
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
