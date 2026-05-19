import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  tripService,
  bookingService,
} from '../../../src/services/api'
import { formatPkr, STORAGE_KEYS } from '../../../utils/tripCostCalculator'

const QUICK_MODULES = [
  { label: 'Destinations', path: '/destination', icon: '🗺️', desc: 'Explore Pakistan' },
  { label: 'Flights', path: '/traveler/flights', icon: '✈️', desc: 'Domestic routes' },
  { label: 'Hotels', path: '/traveler/hotels', icon: '🏨', desc: 'Live PKR prices' },
  { label: 'Transport', path: '/transport', icon: '🚌', desc: 'Buses & coaches' },
  { label: 'Cost estimate', path: '/cost-estimator', icon: '💰', desc: 'PKR breakdown' },
  { label: 'Budget', path: '/budget-planner', icon: '📊', desc: 'Stay on track' },
  { label: 'Trip overview', path: '/trip-overview', icon: '📋', desc: 'Itinerary & map' },
  { label: 'AI assistant', path: '/chatbot', icon: '🤖', desc: 'Travel tips' },
]

function StatCard({ title, value, sub, accent = 'violet' }) {
  const ring =
    accent === 'emerald'
      ? 'ring-emerald-100'
      : accent === 'amber'
        ? 'ring-amber-100'
        : 'ring-violet-100'
  const dot =
    accent === 'emerald'
      ? 'bg-emerald-500'
      : accent === 'amber'
        ? 'bg-amber-500'
        : 'bg-violet-500'

  return (
    <div
      className={`flex-1 min-w-[160px] rounded-2xl bg-white p-4 ring-1 ${ring} shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <span className={`w-2 h-2 rounded-full ${dot}`} />
      </div>
      <p className="mt-2 text-xl font-black text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-500 font-medium mt-0.5">{sub}</p>}
    </div>
  )
}

function tripProgress(trip) {
  if (!trip?.startDate || !trip?.endDate) return 0
  const now = Date.now()
  const start = new Date(trip.startDate).getTime()
  const end = new Date(trip.endDate).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 0
  if (now < start) return 0
  if (now > end) return 100
  return Math.min(100, Math.round(((now - start) / (end - start)) * 100))
}

function formatTripDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d)) return null
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
}

function loadEstimateBudget() {
  try {
    const b = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGET) || '{}')
    if (b.maxBudget) return b.maxBudget
    if (b.totalBudget) return b.totalBudget
    const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULT) || '{}')
    return r.total || 0
  } catch {
    return 0
  }
}

export default function MainDashboard() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [bookingsCount, setBookingsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const userName = localStorage.getItem('userName') || 'Traveler'

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [tripData, flights, transport] = await Promise.all([
          tripService.getAllTrips().catch(() => []),
          bookingService.getFlightBookings().catch(() => []),
          bookingService.getTransportBookings().catch(() => []),
        ])
        if (cancelled) return
        setTrips(Array.isArray(tripData) ? tripData : [])
        setBookingsCount(
          (Array.isArray(flights) ? flights.length : 0) +
            (Array.isArray(transport) ? transport.length : 0)
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const activeTrip = useMemo(() => {
    const ongoing = trips.find((t) => t.status === 'ongoing')
    if (ongoing) return ongoing
    const now = Date.now()
    const inRange = trips.find((t) => {
      const s = new Date(t.startDate).getTime()
      const e = new Date(t.endDate).getTime()
      return !Number.isNaN(s) && !Number.isNaN(e) && now >= s && now <= e
    })
    return inRange || trips[0] || null
  }, [trips])

  const plannedCount = trips.filter((t) => t.status === 'planned').length
  const completedCount = trips.filter((t) => t.status === 'completed').length
  const progress = activeTrip ? tripProgress(activeTrip) : 0
  const untilStart = activeTrip ? daysUntil(activeTrip.startDate) : null
  const budgetDisplay = activeTrip?.budget
    ? formatPkr(activeTrip.budget)
    : loadEstimateBudget()
      ? formatPkr(loadEstimateBudget())
      : 'PKR 0'

  const statusText = activeTrip
    ? activeTrip.status === 'ongoing'
      ? 'Active now'
      : untilStart != null && untilStart > 0
        ? `Starts in ${untilStart} day${untilStart !== 1 ? 's' : ''}`
        : progress >= 100
          ? 'Completed'
          : 'Planned'
    : 'No active trip'

  return (
    <div className="space-y-8">
      {/* Welcome hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-10"
      >
        <div className="relative z-10 flex flex-wrap justify-between gap-6 items-end">
          <div>
            <p className="text-violet-300 text-xs font-black uppercase tracking-[0.25em]">
              Pakistan Travel Planner
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
              Welcome back, {userName.split(' ')[0]}
            </h1>
            
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/plan-my-trip')}
              className="rounded-2xl text-black bg-white/15 border border-white/25 px-5 py-2.5 text-sm font-black hover:bg-white/25"
            >
              Plan my trip
            </button>
            <button
              type="button"
              onClick={() => navigate('/create-trip')}
              className="rounded-2xl bg-white text-violet-950 px-5 py-2.5 text-sm font-black hover:bg-violet-50"
            >
              + New trip
            </button>
          </div>
        </div>
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl"
          aria-hidden
        />
      </motion.section>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <StatCard title="Trip status" value={loading ? '…' : statusText} accent="violet" />
        <StatCard
          title="Budget"
          value={loading ? '…' : budgetDisplay}
          sub={activeTrip ? activeTrip.destination : 'From cost estimator'}
          accent="emerald"
        />
        <StatCard
          title="Departure"
          value={
            loading
              ? '…'
              : activeTrip
                ? formatTripDate(activeTrip.startDate)
                : 'Not set'
          }
          accent="amber"
        />
        <StatCard
          title="Bookings"
          value={loading ? '…' : String(bookingsCount)}
          sub="Flights & transport"
          accent="violet"
        />
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => navigate('/create-trip')}
          className="group relative overflow-hidden rounded-[2rem] text-left min-h-[220px] ring-1 ring-slate-200 shadow-sm hover:shadow-xl hover:ring-violet-200 transition"
        >
          <img
            src="/pictures/img1.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-950/90 via-indigo-950/50 to-transparent" />
          <div className="relative p-6 flex flex-col justify-end h-full min-h-[220px]">
            <span className="text-3xl">✨</span>
            <h2 className="text-xl font-black text-white mt-2">Create new trip</h2>
            <p className="text-violet-200 text-sm font-medium mt-1">
              Dates, destinations & budget → trip overview
            </p>
            <span className="mt-4 inline-flex text-sm font-black text-white group-hover:translate-x-1 transition">
              Get started →
            </span>
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] bg-white ring-1 ring-slate-100 p-6 shadow-sm flex flex-col"
        >
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Current trip
          </p>
          <h2 className="text-xl font-black text-slate-900 mt-1 truncate">
            {activeTrip?.destination || 'No trip yet'}
          </h2>
          {activeTrip && (
            <p className="text-sm text-slate-500 font-medium mt-1">
              {formatTripDate(activeTrip.startDate)} – {formatTripDate(activeTrip.endDate)}
              {activeTrip.travelers ? ` · ${activeTrip.travelers} travelers` : ''}
            </p>
          )}
          <div className="mt-4 flex-1">
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-bold mt-2">
              {activeTrip
                ? progress > 0 && progress < 100
                  ? `${progress}% through your journey`
                  : statusText
                : 'Create a trip to start planning'}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/trip-overview')}
              disabled={!activeTrip}
              className="rounded-xl bg-violet-600 text-black px-4 py-2 text-sm font-black hover:bg-violet-500 disabled:opacity-40"
            >
              Trip overview
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="rounded-xl bg-slate-50 text-slate-800 px-4 py-2 text-sm font-black ring-1 ring-slate-300 hover:ring-violet-200"
            >
              Bookings
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[2rem] bg-white ring-1 ring-slate-100 p-6 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase">Your trips</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{trips.length}</p>
            </div>
            <span className="text-[10px] font-black px-2 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100">
              {plannedCount} planned · {completedCount} done
            </span>
          </div>
          <ul className="mt-4 space-y-2 flex-1 overflow-y-auto max-h-36">
            {loading && (
              <li className="text-sm text-slate-400 font-medium">Loading trips…</li>
            )}
            {!loading && trips.length === 0 && (
              <li className="text-sm text-slate-400 font-medium">No saved trips yet.</li>
            )}
            {trips.slice(0, 4).map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => navigate('/trip-overview')}
                  className="w-full text-left rounded-xl px-3 py-2 hover:bg-violet-50 ring-1 ring-transparent hover:ring-violet-100 transition"
                >
                  <p className="font-bold text-slate-900 text-sm truncate">{t.destination}</p>
                  <p className="text-xs text-slate-500">
                    {formatTripDate(t.startDate)} · {t.status || 'planned'}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/past-trips')}
            className="mt-4 w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-black hover:bg-black transition"
          >
            View trip history
          </button>
        </motion.div>
      </div>

      {/* Quick modules */}
      <section>
        <h2 className="text-lg font-black text-slate-900 mb-4">Quick access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_MODULES.map((m, i) => (
            <motion.button
              key={m.path}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.02 }}
              onClick={() => navigate(m.path)}
              className="text-left rounded-2xl bg-white p-4 ring-1 ring-slate-100 hover:ring-violet-200 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <span className="text-2xl">{m.icon}</span>
              <p className="font-black text-slate-900 text-sm mt-2">{m.label}</p>
              <p className="text-xs text-slate-500 font-medium">{m.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 text-white flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h3 className="text-xl font-black">Ready for your next Pakistan trip?</h3>
          <p className="text-violet-100 font-medium mt-1 text-sm">
            Use the cost estimator, then save your plan and open the trip overview.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/cost-estimator')}
            className="rounded-2xl bg-white text-violet-950 px-5 py-2.5 text-sm font-black"
          >
            Cost estimator
          </button>
          <button
            type="button"
            onClick={() => navigate('/weather')}
            className="rounded-2xl bg-white/20 border text-blue-900 border-white/30 px-5 py-2.5 text-sm font-black hover:bg-white/30"
          >
            Weather
          </button>
        </div>
      </motion.div>
    </div>
  )
}
