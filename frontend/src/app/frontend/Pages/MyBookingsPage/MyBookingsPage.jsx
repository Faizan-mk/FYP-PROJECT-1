import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { bookingService, getCurrentUserId } from '../../src/services/api';

const formatPkr = (n) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
    .format(Number(n) || 0)
    .replace('PKR', 'PKR ');

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'flights', label: 'Flights' },
  { id: 'transport', label: 'Transport' },
];

function StatusBadge({ status }) {
  const s = (status || 'confirmed').toLowerCase();
  const styles =
    s === 'cancelled'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : s === 'pending'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ring-1 ${styles}`}>
      {status || 'confirmed'}
    </span>
  );
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [flights, setFlights] = useState([]);
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!getCurrentUserId()) {
        setFlights([]);
        setTransport([]);
        setError('Please log in to view your bookings.');
        return;
      }
      const [f, t] = await Promise.all([
        bookingService.getFlightBookings(),
        bookingService.getTransportBookings(),
      ]);
      setFlights(f);
      setTransport(t);
    } catch (e) {
      setError(e?.message || 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancelFlight = async (id) => {
    if (!window.confirm('Cancel this flight booking?')) return;
    setActionId(id);
    try {
      await bookingService.cancelFlightBooking(id);
      await load();
    } catch (e) {
      alert(e?.message || 'Could not cancel booking.');
    } finally {
      setActionId(null);
    }
  };

  const handleCancelTransport = async (id) => {
    if (!window.confirm('Cancel this transport booking?')) return;
    setActionId(id);
    try {
      await bookingService.cancelTransportBooking(id);
      await load();
    } catch (e) {
      alert(e?.message || 'Could not cancel booking.');
    } finally {
      setActionId(null);
    }
  };

  const totalCount = flights.length + transport.length;
  const activeCount = useMemo(() => {
    const active = (b) => (b.status || 'confirmed').toLowerCase() !== 'cancelled';
    return flights.filter(active).length + transport.filter(active).length;
  }, [flights, transport]);

  const showFlights = tab === 'all' || tab === 'flights';
  const showTransport = tab === 'all' || tab === 'transport';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-20"
    >
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BackToDashboardButton />
          <div className="mt-8 flex flex-wrap justify-between gap-6 items-end">
            <div>
              <p className="text-indigo-300 text-xs font-black uppercase tracking-[0.25em]">
                Flights &amp; buses
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-2">My bookings</h1>
              
            </div>
            <motion.div className="flex gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 text-center">
                <p className="text-2xl font-black">{totalCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Total</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/30 px-5 py-3 text-center">
                <p className="text-2xl font-black text-emerald-300">{activeCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Active</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${
                tab === t.id
                  ? 'bg-indigo-600 text-black shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-indigo-200'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate('/traveler/flights')}
            className="ml-auto px-5 py-2.5 rounded-2xl bg-white text-indigo-700 text-sm font-black ring-1 ring-indigo-200 hover:bg-indigo-50"
          >
            + Book flight
          </button>
          <button
            type="button"
            onClick={() => navigate('/transport')}
            className="px-5 py-2.5 rounded-2xl bg-white text-indigo-700 text-sm font-black ring-1 ring-indigo-200 hover:bg-indigo-50"
          >
            + Book transport
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 font-bold">Loading bookings…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-12 text-center ring-1 ring-slate-200">
            <p className="text-4xl mb-4">🔐</p>
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {showFlights && (
              <section>
                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span>✈️</span> Flight bookings
                  <span className="text-sm font-bold text-slate-400">({flights.length})</span>
                </h2>
                {flights.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center ring-1 ring-slate-100">
                    <p className="text-slate-500 font-medium">No flight bookings yet.</p>
                    <button
                      type="button"
                      onClick={() => navigate('/traveler/flights')}
                      className="mt-4 text-indigo-600 font-black text-sm hover:underline"
                    >
                      Search flights →
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <AnimatePresence>
                      {flights.map((b) => (
                        <motion.article
                          key={b.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-wrap justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-black text-slate-900">
                                  {b.from} → {b.to}
                                </h3>
                                <StatusBadge status={b.status} />
                              </div>
                              <p className="text-slate-500 font-medium mt-1">
                                {b.airlineName || b.airline} · {b.departureDate}
                              </p>
                              {b.bookingReference && (
                                <p className="text-xs text-slate-400 mt-2 font-mono">
                                  Ref: {b.bookingReference}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-indigo-600">{formatPkr(b.price)}</p>
                              <p className="text-xs text-slate-400 mt-1">{b.passengerName}</p>
                            </div>
                          </div>
                          {(b.status || 'confirmed').toLowerCase() !== 'cancelled' && (
                            <button
                              type="button"
                              disabled={actionId === b.id}
                              onClick={() => handleCancelFlight(b.id)}
                              className="mt-4 text-sm font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                            >
                              {actionId === b.id ? 'Cancelling…' : 'Cancel booking'}
                            </button>
                          )}
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            )}

            {showTransport && (
              <section>
                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span>🚌</span> Transport bookings
                  <span className="text-sm font-bold text-slate-400">({transport.length})</span>
                </h2>
                {transport.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center ring-1 ring-slate-100">
                    <p className="text-slate-500 font-medium">No transport bookings yet.</p>
                    <button
                      type="button"
                      onClick={() => navigate('/transport')}
                      className="mt-4 text-indigo-600 font-black text-sm hover:underline"
                    >
                      Browse transport →
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {transport.map((b) => (
                      <motion.article
                        key={b.id}
                        layout
                        className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm"
                      >
                        <div className="flex flex-wrap justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-black text-slate-900">
                                {b.from} → {b.to}
                              </h3>
                              <StatusBadge status={b.status} />
                            </div>
                            <p className="text-slate-500 font-medium mt-1">
                              {b.provider} · {b.type}
                            </p>
                            {b.bookingReference && (
                              <p className="text-xs text-slate-400 mt-2 font-mono">
                                Ref: {b.bookingReference}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-indigo-600">{formatPkr(b.price)}</p>
                            <p className="text-xs text-slate-400 mt-1">{b.passengerName}</p>
                          </div>
                        </div>
                        {(b.status || 'confirmed').toLowerCase() !== 'cancelled' && (
                          <button
                            type="button"
                            disabled={actionId === b.id}
                            onClick={() => handleCancelTransport(b.id)}
                            className="mt-4 text-sm font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                          >
                            {actionId === b.id ? 'Cancelling…' : 'Cancel booking'}
                          </button>
                        )}
                      </motion.article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
