import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../src/config/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const AdminHotelsPage = () => {
    const [hotels, setHotels] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        price: '',
        stars: 4,
        rating: 4.0,
        breakfast: true,
        wifi: true,
        bookingUrl: ''
    });
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
            console.error('Error fetching hotels:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHotel) {
                await api.put(`/hotels/${editingHotel.id}`, formData);
            } else {
                await api.post('/hotels', formData);
            }
            fetchHotels();
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error saving hotel:', error);
            alert('Error saving hotel. Please make sure you are logged in as admin.');
        }
    };

    const handleEdit = (hotel) => {
        setEditingHotel(hotel);
        setFormData({
            name: hotel.name,
            image: hotel.image || '',
            price: hotel.price,
            stars: hotel.stars,
            rating: hotel.rating,
            breakfast: hotel.breakfast,
            wifi: hotel.wifi,
            bookingUrl: hotel.bookingUrl || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                await api.delete(`/hotels/${id}`);
                fetchHotels();
            } catch (error) {
                console.error('Error deleting hotel:', error);
                alert('Error deleting hotel. Please make sure you are logged in as admin.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            image: '',
            price: '',
            stars: 4,
            rating: 4.0,
            breakfast: true,
            wifi: true,
            bookingUrl: ''
        });
        setEditingHotel(null);
    };

    const filteredHotels = hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Container */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <BackToDashboardButton />
                            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <span className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                                    🏨
                                </span>
                                Hotel Management
                            </h1>
                            <p className="text-gray-500 mt-2">Manage your hotel listings and availability</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search listings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(true);
                                }}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                            >
                                <span>+</span> Add Hotel
                            </motion.button>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border border-indigo-100">
                            Total: {hotels.length}
                        </div>
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border border-green-100">
                            Active Listings: {hotels.length}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading your hotels...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredHotels.map((hotel) => (
                                <motion.div
                                    key={hotel.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group"
                                >
                                    <div className="relative h-48 bg-gray-100">
                                        {hotel.image ? (
                                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">🏢</div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(hotel)}
                                                className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(hotel.id)}
                                                className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{hotel.name}</h3>
                                            <div className="flex items-center text-yellow-500 font-bold">
                                                ★ <span className="text-gray-900 ml-1">{hotel.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 mb-4">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={i < hotel.stars ? "text-yellow-400" : "text-gray-200"}>★</span>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {hotel.breakfast && <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">🥞 Breakfast</span>}
                                            {hotel.wifi && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">📶 WiFi</span>}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">PKR / Night</p>
                                                <p className="text-2xl font-black text-indigo-600">{hotel.price?.toLocaleString()}</p>
                                            </div>
                                            <a
                                                href={hotel.bookingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            >
                                                🔗 Link
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
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
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-2xl font-black text-gray-900">
                                    {editingHotel ? 'Edit Hotel Listing' : 'Create New Listing'}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Hotel Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Image URL</label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Price (PKR)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Stars (1-5)</label>
                                        <select
                                            name="stars"
                                            value={formData.stars}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                                        >
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">User Rating (0-5)</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Booking Link</label>
                                        <input
                                            type="url"
                                            name="bookingUrl"
                                            value={formData.bookingUrl}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex gap-8 py-4 px-6 bg-indigo-50 rounded-2xl">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="breakfast"
                                                checked={formData.breakfast}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-bold text-indigo-900 text-black">Breakfast Included</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="wifi"
                                                checked={formData.wifi}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-bold text-indigo-900 text-black">Free WiFi</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Discard Changes
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 px-6 rounded-2xl font-bold bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                    >
                                        {editingHotel ? 'Update Listing' : 'Publish Listing'}
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

export default AdminHotelsPage;
