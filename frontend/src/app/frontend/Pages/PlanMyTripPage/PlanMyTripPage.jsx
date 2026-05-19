import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { tripService } from '../../src/services/api';

const STEPS = [
  {
    step: 1,
    title: 'Pick destinations',
    desc: 'Explore Hunza, Swat, Lahore and more across Pakistan.',
    icon: '🗺️',
    path: '/destination',
    cta: 'Browse destinations',
  },
  {
    step: 2,
    title: 'Tour packages',
    desc: 'Curated solo, family and group packages with live PKR pricing.',
    icon: '🧳',
    path: '/packages',
    cta: 'View packages',
  },
  {
    step: 3,
    title: 'Flights',
    desc: 'Search domestic airlines and compare routes.',
    icon: '✈️',
    path: '/traveler/flights',
    cta: 'Search flights',
  },
  {
    step: 4,
    title: 'Hotels',
    desc: 'Live hotel availability and prices across cities.',
    icon: '🏨',
    path: '/traveler/hotels',
    cta: 'Find hotels',
  },
  {
    step: 5,
    title: 'Transport',
    desc: 'Buses and coaches between major Pakistani cities.',
    icon: '🚌',
    path: '/transport',
    cta: 'Plan transport',
  },
  {
    step: 6,
    title: 'Save your trip',
    desc: 'Create a trip with dates, travelers and budget on your dashboard.',
    icon: '📋',
    path: '/create-trip',
    cta: 'Create trip',
  },
];

export default function PlanMyTripPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await tripService.getAllTrips();
        setTrips(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setTrips([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latest = trips[0];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-violet-950 via-indigo-950 to-slate-900 text-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <BackToDashboardButton />
          <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-violet-300 text-xs font-black uppercase tracking-[0.25em]">
              Step-by-step
            </p>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-2">Plan my trip</h1>
            <p className="text-slate-400 font-medium mt-3 max-w-2xl text-lg">
              Build your Pakistan journey from destination to bookings — everything links to real
              modules in this app.
            </p>
          </motion.div>

          {!loading && latest && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-[2rem] bg-white/10 border border-white/20 p-6 backdrop-blur-md flex flex-wrap justify-between gap-4 items-center"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">
                  Latest trip
                </p>
                <p className="text-2xl font-black mt-1">{latest.destination || 'Your trip'}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {latest.startDate
                    ? new Date(latest.startDate).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Dates not set'}
                  {latest.budget ? ` · PKR ${Number(latest.budget).toLocaleString()}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/trip-overview')}
                className="rounded-2xl bg-white text-indigo-950 px-6 py-3 text-sm font-black hover:bg-violet-50 transition-colors"
              >
                Open trip overview →
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STEPS.map((s, idx) => (
            <motion.button
              key={s.step}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(s.path)}
              className="text-left bg-white rounded-[2rem] p-7 ring-1 ring-slate-100 shadow-sm hover:shadow-xl hover:ring-indigo-200 hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="flex-none w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-2xl grid place-items-center shadow-lg shadow-indigo-200">
                  {s.icon}
                </span>
                <motion.div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                    Step {s.step}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5 group-hover:text-indigo-700 transition-colors">
                    {s.title}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">{s.desc}</p>
                  <span className="inline-flex mt-4 text-sm font-black text-indigo-600 group-hover:translate-x-1 transition-transform">
                    {s.cta} →
                  </span>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-600 p-8 sm:p-10 text-white flex flex-wrap justify-between items-center gap-6"
        >
          <div>
            <h3 className="text-2xl font-black">Need help planning?</h3>
            <p className="text-indigo-100 font-medium mt-2">
              Ask the AI travel assistant for routes, weather tips and package ideas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/chatbot')}
              className="rounded-2xl bg-white text-indigo-950 px-6 py-3 text-sm font-black hover:bg-indigo-50"
            >
              Open chatbot
            </button>
            <button
              type="button"
              onClick={() => navigate('/weather')}
              className="rounded-2xl bg-white/15 border border-white/30 text-black px-6 py-3 text-sm font-black hover:bg-white/25"
            >
              Check weather
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
