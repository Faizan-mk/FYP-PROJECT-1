import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hotelService } from '../../src/services/api';
import { parseHotelMeta } from '../TravelerHotelsPage/hotelMeta';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const EMPTY_FORM = {
    name: '',
    city: '',
    price: '',
    stars: '4',
    rating: '4.0',
    image: '',
    description: '',
    roomsAvailable: '12',
    services: '',
    gallery: '',
    breakfast: true,
    wifi: true,
    bookingUrl: '',
};

const AdminHotelsPage = () => {
    const [hotels, setHotels] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const data = await hotelService.getAllHotels();
            setHotels(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const buildPayload = () => {
        const services = formData.services
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        const gallery = formData.gallery
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        return {
            name: formData.name.trim(),
            price: Number(formData.price),
            stars: Number(formData.stars) || 4,
            rating: Number(formData.rating) || 4,
            image: formData.image.trim(),
            breakfast: formData.breakfast,
            wifi: formData.wifi,
            bookingUrl: formData.bookingUrl.trim(),
            images: {
                city: formData.city.trim() || 'Pakistan',
                roomsAvailable: Number(formData.roomsAvailable) || 12,
                description: formData.description.trim(),
                services,
                gallery,
            },
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = buildPayload();
            if (editingHotel) {
                await hotelService.updateHotel(editingHotel.id, payload);
            } else {
                await hotelService.createHotel(payload);
            }
            await fetchHotels();
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error saving hotel:', error);
            alert('Error saving hotel. Please make sure you are logged in as admin.');
        }
    };

    const handleEdit = (hotel) => {
        const meta = parseHotelMeta(hotel);
        setEditingHotel(hotel);
        setFormData({
            name: hotel.name || '',
            city: meta.city || '',
            price: String(hotel.price ?? ''),
            stars: String(hotel.stars ?? 4),
            rating: String(hotel.rating ?? 4),
            image: hotel.image || '',
            description: meta.description || '',
            roomsAvailable: String(meta.roomsAvailable ?? 12),
            services: meta.services?.join(', ') || '',
            gallery: meta.gallery?.join(', ') || '',
            breakfast: hotel.breakfast !== false,
            wifi: hotel.wifi !== false,
            bookingUrl: hotel.bookingUrl || '',
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hotel?')) return;
        try {
            await hotelService.deleteHotel(id);
            fetchHotels();
        } catch (error) {
            console.error('Error deleting hotel:', error);
            alert('Error deleting hotel.');
        }
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setEditingHotel(null);
    };

    const filteredHotels = hotels.filter((h) => {
        const meta = parseHotelMeta(h);
        const q = searchQuery.toLowerCase();
        return (
            h.name?.toLowerCase().includes(q) ||
            meta.city?.toLowerCase().includes(q)
        );
    });

    return (
        <motion.div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <BackToDashboardButton />
                        <h1 className="text-4xl font-black text-slate-900 mt-2">Hotel Registry</h1>
                        <p className="text-slate-500 font-medium">
                            Add and manage hotels shown to travelers across Pakistan.
                        </p>
                    </motion.div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search hotels..."
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
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
                        >
                            <span>🏨</span> Add Hotel
                        </motion.button>
                    </div>
                </div>

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center py-40"
                    >
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {filteredHotels.length > 0 ? (
                            filteredHotels.map((hotel, idx) => {
                                const meta = parseHotelMeta(hotel);
                                return (
                                    <motion.div
                                        key={hotel.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-slate-100 hover:border-indigo-100 hover:shadow-2xl transition-all group relative"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative h-56 overflow-hidden"
                                        >
                                            <img
                                                src={
                                                    hotel.image ||
                                                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600'
                                                }
                                                alt={hotel.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(hotel)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white shadow-xl rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(hotel.id)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white shadow-xl rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                            <div className="absolute bottom-4 left-4 flex gap-2">
                                                <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">
                                                    {'★'.repeat(hotel.stars || 4)}
                                                </span>
                                                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">
                                                    {meta.city}
                                                </span>
                                            </div>
                                        </motion.div>

                                        <div className="p-8">
                                            <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                                {hotel.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                    <span className="text-lg">💰</span>
                                                    <span className="text-slate-700 text-xs font-black">
                                                        Rs. {Number(hotel.price || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-500 text-sm font-black">
                                                    ⭐ {Number(hotel.rating || 0).toFixed(1)}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-xs text-slate-500 font-medium line-clamp-2">
                                                {meta.description || 'No description'}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold italic">
                                    No hotels registered. Click &quot;Add Hotel&quot; to begin.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

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
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative z-10"
                        >
                            <motion.div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 sticky top-0 z-10">
                                <h2 className="text-2xl font-black text-slate-900 italic">
                                    {editingHotel ? 'Edit Hotel' : 'Add Hotel'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="text-slate-400 hover:text-slate-900 transition-all font-bold"
                                >
                                    ✕
                                </button>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Hotel name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 font-bold outline-none"
                                            placeholder="e.g. Serena Hotel Islamabad"
                                            required
                                        />
                                    </div>

                                    <motion.div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-bold outline-none"
                                            placeholder="Islamabad"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Price (PKR / night)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-bold outline-none"
                                            placeholder="25000"
                                            min="0"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Stars
                                        </label>
                                        <select
                                            name="stars"
                                            value={formData.stars}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-bold outline-none"
                                        >
                                            {[3, 4, 5].map((n) => (
                                                <option key={n} value={n}>
                                                    {n} stars
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>

                                    <motion.div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Rating
                                        </label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            step="0.1"
                                            min="1"
                                            max="5"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-bold outline-none"
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Rooms available
                                        </label>
                                        <input
                                            type="number"
                                            name="roomsAvailable"
                                            value={formData.roomsAvailable}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-bold outline-none"
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Cover image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-medium outline-none"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-medium outline-none resize-none"
                                            placeholder="Short description for travelers..."
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Services (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="services"
                                            value={formData.services}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-medium outline-none"
                                            placeholder="Wi-Fi, Pool, Spa, Parking"
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Gallery URLs (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="gallery"
                                            value={formData.gallery}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-medium outline-none"
                                            placeholder="https://..., https://..."
                                        />
                                    </motion.div>

                                    <motion.div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Booking URL
                                        </label>
                                        <input
                                            type="url"
                                            name="bookingUrl"
                                            value={formData.bookingUrl}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 font-medium outline-none"
                                            placeholder="https://..."
                                        />
                                    </motion.div>

                                    <motion.div className="flex gap-6 sm:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="breakfast"
                                                checked={formData.breakfast}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded accent-indigo-600"
                                            />
                                            <span className="font-bold text-slate-700">Breakfast included</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="wifi"
                                                checked={formData.wifi}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded accent-indigo-600"
                                            />
                                            <span className="font-bold text-slate-700">Free Wi-Fi</span>
                                        </label>
                                    </motion.div>
                                </motion.div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-5 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-all uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all uppercase tracking-widest"
                                    >
                                        {editingHotel ? 'Update Hotel' : 'Publish Hotel'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminHotelsPage;
