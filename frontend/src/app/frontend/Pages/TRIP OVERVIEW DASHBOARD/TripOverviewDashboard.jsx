import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { tripService, bookingService } from '../../src/services/api'
import {
  STORAGE_KEYS,
  formatPkr,
  calculateTripCost,
} from '../../utils/tripCostCalculator'
import { buildTripItinerary } from '../../utils/buildTripItinerary'
import TripSummaryCard from './Components/TripSummaryCard'
import ItineraryTimeline from './Components/ItineraryTimeline'
import DestinationsMap from './Components/DestinationsMap'
import ActionButtons from './Components/ActionButtons'
import BackToDashboardButton from '../../components/BackToDashboardButton'

const PAK_CITY_COORDS = {
  islamabad: [33.6844, 73.0479],
  lahore: [31.5204, 74.3587],
  karachi: [24.8607, 67.0011],
  peshawar: [34.0151, 71.5249],
  multan: [30.1575, 71.5249],
  hunza: [36.3167, 74.65],
  skardu: [35.2971, 75.6333],
  swat: [35.2227, 72.4258],
  murree: [33.907, 73.3943],
  naran: [34.9039, 73.6501],
  quetta: [30.1798, 66.975],
  faisalabad: [31.4504, 73.135],
}

const QUICK_LINKS = [
  { label: 'Destinations', path: '/destination', icon: '🗺️' },
  { label: 'Flights', path: '/traveler/flights', icon: '✈️' },
  { label: 'Hotels', path: '/traveler/hotels', icon: '🏨' },
  { label: 'Transport', path: '/transport', icon: '🚌' },
  { label: 'Budget', path: '/budget-planner', icon: '📊' },
  { label: 'Weather', path: '/weather', icon: '☁️' },
]

function cityCoords(name) {
  const key = String(name || '').toLowerCase()
  for (const [city, [lat, lng]] of Object.entries(PAK_CITY_COORDS)) {
    if (key.includes(city)) return { name: name || city, lat, lng }
  }
  return { name: name || 'Pakistan', lat: 33.6844, lng: 73.0479 }
}

function calcDays(start, end, fallback = 0) {
  if (!start || !end) return fallback
  const s = new Date(start)
  const e = new Date(end)
  if (Number.isNaN(s) || Number.isNaN(e)) return fallback
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1)
}

function formatDateRange(start, end) {
  if (!start || !end) return 'Not specified'
  const opts = { day: 'numeric', month: 'short', year: 'numeric' }
  const startStr = new Date(start).toLocaleDateString('en-PK', opts)
  const endStr = new Date(end).toLocaleDateString('en-PK', opts)
  return `${startStr} – ${endStr}`
}

function mapBreakdown(rows, total) {
  return (rows || []).map((row) => ({
    category: row.label || row.category || 'Other',
    amount: row.amount || 0,
    percentage: total > 0 ? Math.round(((row.amount || 0) / total) * 100) : 0,
  }))
}

function statusLabel(status) {
  if (status === 'ongoing') return { text: 'Active', tone: 'bg-emerald-500' }
  if (status === 'completed') return { text: 'Completed', tone: 'bg-slate-400' }
  return { text: 'Planned', tone: 'bg-violet-500' }
}

function loadEstimate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULT)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  try {
    const draft = localStorage.getItem(STORAGE_KEYS.DRAFT)
    if (draft) return calculateTripCost(JSON.parse(draft))
  } catch {
    /* ignore */
  }
  return null
}

export default function TripOverviewDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [trip, setTrip] = useState(null)
  const [estimate, setEstimate] = useState(null)
  const [budgetMeta, setBudgetMeta] = useState({})
  const [destinations, setDestinations] = useState([])
  const [transportBooked, setTransportBooked] = useState(null)
  const [flightBookings, setFlightBookings] = useState([])
  const [transportBookings, setTransportBookings] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [trips, flights, transport] = await Promise.all([
          tripService.getAllTrips().catch(() => []),
          bookingService.getFlightBookings().catch(() => []),
          bookingService.getTransportBookings().catch(() => []),
        ])

        const tripList = Array.isArray(trips) ? trips : []
        const active =
          tripList.find((t) => t.status === 'ongoing') || tripList[0] || null
        setTrip(active)
        setFlightBookings(Array.isArray(flights) ? flights.slice(0, 3) : [])
        setTransportBookings(Array.isArray(transport) ? transport.slice(0, 3) : [])
      } catch (err) {
        console.error('Trip overview load failed:', err)
      }

      const locationBudget = location.state?.budgetData || {}
      let savedBudget = {}
      try {
        savedBudget = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGET) || '{}')
      } catch {
        savedBudget = {}
      }
      setBudgetMeta({ ...savedBudget, ...locationBudget })

      setEstimate(loadEstimate())

      try {
        setDestinations(
          JSON.parse(localStorage.getItem('selectedDestinations') || '[]')
        )
      } catch {
        setDestinations([])
      }

      try {
        const t = JSON.parse(localStorage.getItem('bookedTransportOption') || 'null')
        setTransportBooked(t && typeof t === 'object' ? t : null)
      } catch {
        setTransportBooked(null)
      }

      setLoading(false)
    }
    load()
  }, [location.state])

  const overview = useMemo(() => {
    const est = estimate || calculateTripCost({})
    const destination =
      trip?.destination ||
      est.destination ||
      destinations.map((d) => d.name).filter(Boolean).join(', ') ||
      'Not specified'

    const startDate = trip?.startDate || destinations[0]?.startDate
    const endDate = trip?.endDate || destinations[0]?.endDate
    const days =
      calcDays(startDate, endDate, 0) || est.days || destinations.length || 3

    const travelers = trip?.travelers || est.travelers || 1
    const estimatedCost =
      budgetMeta.estimatedCost ?? est.total ?? trip?.budget ?? 0
    const maxBudget =
      budgetMeta.maxBudget ?? budgetMeta.totalBudget ?? trip?.budget ?? estimatedCost

    const transportMode =
      transportBooked?.mode?.label ||
      transportBooked?.mode ||
      est.transportModeId ||
      trip?.tripType ||
      'Not specified'

    const breakdown = mapBreakdown(
      budgetMeta.breakdown || est.breakdown,
      estimatedCost
    )

    const itinerary = buildTripItinerary({
      days,
      startDate,
      origin: est.origin || 'Islamabad',
      destination,
      destinations,
      estimate: est,
      transportBooked,
      flightBookings,
      transportBookings,
      travelers,
    })

    const mapPoints = [
      ...destinations.map((d) => cityCoords(d.name)),
      cityCoords(destination.split(',')[0]),
    ].filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i)

    const hasData = Boolean(
      trip ||
        destination !== 'Not specified' ||
        (est.total && est.total > 0) ||
        destinations.length > 0
    )

    return {
      destination,
      origin: est.origin || 'Islamabad',
      dates: formatDateRange(startDate, endDate),
      days,
      travelers,
      status: trip?.status || 'planned',
      mode: transportMode,
      estimatedCost,
      maxBudget,
      cost: formatPkr(estimatedCost),
      budget: formatPkr(maxBudget),
      budgetBreakdown: breakdown,
      itinerary,
      mapPoints: mapPoints.length ? mapPoints : [cityCoords('Islamabad')],
      hasData,
    }
  }, [
    trip,
    estimate,
    budgetMeta,
    destinations,
    transportBooked,
    flightBookings,
    transportBookings,
  ])

  const status = statusLabel(overview.status)
  const budgetPercent =
    overview.maxBudget > 0
      ? Math.min(100, Math.round((overview.estimatedCost / overview.maxBudget) * 100))
      : 0
  const isOverBudget = overview.estimatedCost > overview.maxBudget

  const sharePlan = async () => {
    const text = [
      'Pakistan Travel Planner – Trip Overview',
      `Destination: ${overview.destination}`,
      `Dates: ${overview.dates}`,
      `Travelers: ${overview.travelers}`,
      `Estimated: ${overview.cost}`,
      `Budget: ${overview.budget}`,
    ].join('\n')
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My trip plan', text })
      } else {
        await navigator.clipboard.writeText(text)
        alert('Trip summary copied to clipboard.')
      }
    } catch {
      /* user cancelled */
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full"
          />
          <p className="font-bold text-slate-600">Loading your trip overview…</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 text-white"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14"
        >
          <BackToDashboardButton />
          <div className="mt-8 flex flex-wrap justify-between gap-6 items-end">
            <div>
              <p className="text-violet-300 text-xs font-black uppercase tracking-[0.25em]">
                Trip Overview Dashboard
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-2">
                {overview.destination !== 'Not specified'
                  ? overview.destination
                  : 'Your Pakistan trip'}
              </h1>
              <p className="text-slate-400 font-medium mt-3 max-w-2xl">
                Summary, itinerary, bookings and budget — synced from your planner,
                estimator and saved trips.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${status.tone} animate-pulse`}
              />
              <div className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">
                  Status
                </p>
                <p className="text-lg font-black">{status.text}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {!overview.hasData && (
          <div className="mb-8 rounded-[2rem] bg-white p-8 ring-1 ring-slate-100 shadow-sm text-center">
            <p className="text-4xl mb-3">🧭</p>
            <h2 className="text-xl font-black text-slate-900">No trip plan yet</h2>
            <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">
              Pick destinations, run the cost estimator, or create a trip to see your
              overview here.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              <button
                type="button"
                onClick={() => navigate('/plan-my-trip')}
                className="rounded-2xl bg-violet-600 text-white px-6 py-3 text-sm font-black hover:bg-violet-500"
              >
                Plan my trip
              </button>
              <button
                type="button"
                onClick={() => navigate('/create-trip')}
                className="rounded-2xl bg-white text-violet-700 px-6 py-3 text-sm font-black ring-1 ring-violet-200"
              >
                Create trip
              </button>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TripSummaryCard data={overview} />

            <div className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <h2 className="text-lg font-black text-slate-900">Budget vs estimate</h2>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    isOverBudget
                      ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                      : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  }`}
                >
                  {isOverBudget ? 'Over budget' : 'Within budget'}
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
                className="h-3 rounded-full bg-slate-100 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetPercent}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`h-full rounded-full ${
                    isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
              </motion.div>
              <div className="mt-3 flex justify-between text-sm font-bold text-slate-600">
                <span>Estimated {overview.cost}</span>
                <span>Limit {overview.budget}</span>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-900">Itinerary</h2>
                <span className="text-xs font-black text-violet-600 bg-violet-50 px-3 py-1 rounded-full ring-1 ring-violet-100">
                  {overview.days} {overview.days === 1 ? 'day' : 'days'}
                </span>
              </div>
              <ItineraryTimeline days={overview.itinerary} />
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-8">
            <DestinationsMap points={overview.mapPoints} />

            {(flightBookings.length > 0 || transportBookings.length > 0) && (
              <div className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-4">Your bookings</h2>
                <ul className="space-y-3 text-sm">
                  {flightBookings.map((b) => (
                    <li
                      key={b.id}
                      className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
                    >
                      <p className="font-bold text-slate-900">
                        ✈️ {b.from} → {b.to}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {b.airlineName || b.airline} · {b.departureDate || '—'}
                      </p>
                    </li>
                  ))}
                  {transportBookings.map((b) => (
                    <li
                      key={b.id}
                      className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
                    >
                      <p className="font-bold text-slate-900">
                        🚌 {b.from} → {b.to}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {b.provider} · PKR {Number(b.price || 0).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate('/my-bookings')}
                  className="mt-4 text-sm font-black text-violet-600 hover:underline"
                >
                  View all bookings →
                </button>
              </div>
            )}

            <div className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4">Quick links</h2>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.map((link) => (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="rounded-xl bg-slate-50 hover:bg-violet-50 hover:ring-violet-200 ring-1 ring-slate-100 p-3 text-left text-sm font-bold text-slate-800 transition"
                  >
                    <span className="mr-1">{link.icon}</span>
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <ActionButtons
              onEdit={() => navigate('/create-trip')}
              onBudget={() => navigate('/budget-planner')}
              onShare={sharePlan}
            />
          </aside>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/budget-planner')}
            className="flex-1 rounded-2xl bg-white text-slate-800 py-4 font-black ring-1 ring-slate-200 hover:ring-violet-200 transition"
          >
            ← Budget planner
          </button>
          <button
            type="button"
            onClick={() => navigate('/weather', { state: { city: overview.destination } })}
            className="flex-1 rounded-2xl bg-violet-600 text-white py-4 font-black hover:bg-violet-500 transition"
          >
            Check weather →
          </button>
          <button
            type="button"
            onClick={() => navigate('/plan-my-trip')}
            className="flex-1 rounded-2xl bg-white text-violet-700 py-4 font-black ring-1 ring-violet-200 hover:bg-violet-50 transition"
          >
            Plan next step
          </button>
        </div>
      </div>
    </motion.div>
  )
}
