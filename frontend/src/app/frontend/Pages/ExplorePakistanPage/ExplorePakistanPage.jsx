import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { destinationService } from '../../src/services/api';

const TRAVEL_TIPS = [
  {
    icon: '🛂',
    title: 'CNIC & permits',
    text: 'Carry valid CNIC. Northern areas may need NOC or permits — check before you go.',
  },
  {
    icon: '💵',
    title: 'Cash in remote areas',
    text: 'ATMs are limited in valleys. Keep cash for food, fuel and local transport.',
  },
  {
    icon: '🌡️',
    title: 'Pack for altitude',
    text: 'Mountain nights are cold even in summer. Layer up and check weather before leaving.',
  },
  {
    icon: '📱',
    title: 'Stay connected',
    text: 'Download offline maps. Share your route with family using the Safety module.',
  },
];

const QUICK_LINKS = [
  { label: 'Weather', icon: '☁️', path: '/weather' },
  { label: 'Safety & SOS', icon: '🛡️', path: '/safety-emergency' },
  { label: 'AI Assistant', icon: '🤖', path: '/chatbot' },
  { label: 'Tour packages', icon: '🧳', path: '/packages' },
  { label: 'My bookings', icon: '📑', path: '/my-bookings' },
  { label: 'Plan trip', icon: '📋', path: '/plan-my-trip' },
];

function normalizeDestList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop';

export default function ExplorePakistanPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const popular = await destinationService.getPopularDestinations(8);
        if (cancelled) return;
        const list = normalizeDestList(popular);
        if (list.length > 0) {
          setDestinations(list);
        } else {
          const all = await destinationService.getAllDestinations();
          if (!cancelled) setDestinations(normalizeDestList(all).slice(0, 8));
        }
      } catch {
        if (!cancelled) setDestinations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <BackToDashboardButton />
          <motion.div className="mt-8 max-w-3xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-emerald-300 text-xs font-black uppercase tracking-[0.25em]">
              Discover Pakistan
            </p>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-2">
              Explore Pakistan
            </h1>
            <p className="text-slate-400 font-medium mt-4 text-lg leading-relaxed">
              Popular destinations, practical travel tips, and shortcuts to flights, hotels and
              safety tools — built for local and domestic travel.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <section className="mb-14">
          <h2 className="text-xl font-black text-slate-900 mb-5">Popular destinations</h2>
          {loading ? (
            <div className="flex justify-center py-16">
              <motion.div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center ring-1 ring-slate-100">
              <p className="text-slate-500 font-medium">No destinations loaded.</p>
              <Link to="/destination" className="mt-4 inline-block text-emerald-600 font-black">
                Browse all destinations →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {destinations.map((d, idx) => {
                const id = d.id ?? d._id;
                const img = d.image || d.imageUrl || d.coverImage || FALLBACK_IMAGE;
                return (
                  <motion.button
                    key={id || d.name}
                    type="button"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => id && navigate(`/destination/${id}`)}
                    className="group text-left bg-white rounded-[2rem] overflow-hidden ring-1 ring-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={img}
                        alt={d.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-black text-white">{d.name}</h3>
                        {d.region && (
                          <p className="text-xs text-white/80 font-medium">{d.region}</p>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-500 line-clamp-2 font-medium">
                        {d.description || d.shortDescription || 'Explore this destination.'}
                      </p>
                      <span className="mt-3 inline-block text-xs font-black text-emerald-600 uppercase tracking-widest">
                        View details →
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/destination"
              className="inline-flex rounded-2xl bg-emerald-600 text-white px-8 py-3 text-sm font-black hover:bg-emerald-500 transition-colors"
            >
              See all destinations
            </Link>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-black text-slate-900 mb-5">Travel tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRAVEL_TIPS.map((tip, idx) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 flex gap-4"
              >
                <span className="text-3xl flex-none">{tip.icon}</span>
                <div>
                  <h3 className="font-black text-slate-900">{tip.title}</h3>
                  <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">{tip.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-5">Quick links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_LINKS.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 ring-1 ring-slate-100 hover:ring-emerald-200 hover:shadow-md transition-all"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-xs font-black text-slate-700 text-center">{link.label}</span>
              </button>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
