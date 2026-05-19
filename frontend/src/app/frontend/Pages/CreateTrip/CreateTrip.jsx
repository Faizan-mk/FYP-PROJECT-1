import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import BackToDashboardButton from '../../components/BackToDashboardButton'
import { tripService, destinationService } from '../../src/services/api'
import {
  PAKISTAN_CITIES,
  calculateTripCost,
  formatPkr,
  STORAGE_KEYS,
} from '../../utils/tripCostCalculator'

const TRIP_TYPES = [
  { id: 'vacation', label: 'Vacation', icon: '🏖️' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'honeymoon', label: 'Honeymoon', icon: '💑' },
]

function calcDays(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 0
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function loadDraftFromEstimator() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

function readSelectedDestinations(locationState) {
  if (locationState?.destinations?.length) return locationState.destinations
  try {
    const raw = localStorage.getItem('selectedDestinations')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function CreateTrip() {
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const estimatorDraft = useMemo(() => loadDraftFromEstimator(), [])

  const [allDestinations, setAllDestinations] = useState([])
  const [selectedDestinations, setSelectedDestinations] = useState(() =>
    readSelectedDestinations(location.state)
  )
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    origin: estimatorDraft?.origin || 'Islamabad',
    startDate: '',
    endDate: '',
    budget: estimatorDraft ? '' : '',
    travelers: estimatorDraft?.travelers || 2,
    tripType: 'vacation',
  })

  const primaryDestination =
    selectedDestinations[0]?.name ||
    estimatorDraft?.destination ||
    search.trim() ||
    ''

  const days = calcDays(form.startDate, form.endDate)

  const suggestedEstimate = useMemo(() => {
    if (!primaryDestination || days < 1) return null
    return calculateTripCost({
      origin: form.origin,
      destination: primaryDestination.split(',')[0].trim(),
      days,
      travelers: form.travelers,
      hotelTierId: estimatorDraft?.hotelTierId || 'standard',
      transportModeId: estimatorDraft?.transportModeId || 'bus',
      foodLevelId: estimatorDraft?.foodLevelId || 'standard',
      activityIds: estimatorDraft?.activityIds || ['sightseeing'],
    })
  }, [primaryDestination, days, form.origin, form.travelers, estimatorDraft])

  useEffect(() => {
    destinationService
      .getAllDestinations()
      .then((data) => setAllDestinations(Array.isArray(data) ? data : []))
      .catch(() => setAllDestinations([]))
  }, [])

  useEffect(() => {
    if (suggestedEstimate && !form.budget) {
      setForm((f) => ({ ...f, budget: String(suggestedEstimate.total) }))
    }
  }, [suggestedEstimate?.total])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filteredDestinations = allDestinations.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) &&
      !selectedDestinations.some((s) => s.id === d.id)
  )

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  const addDestination = (dest) => {
    const next = [...selectedDestinations, dest]
    setSelectedDestinations(next)
    localStorage.setItem('selectedDestinations', JSON.stringify(next))
    setSearch('')
    setShowDropdown(false)
  }

  const removeDestination = (id) => {
    const next = selectedDestinations.filter((d) => d.id !== id)
    setSelectedDestinations(next)
    localStorage.setItem('selectedDestinations', JSON.stringify(next))
  }

  const validate = () => {
    const dest =
      selectedDestinations.length > 0
        ? selectedDestinations.map((d) => d.name).join(', ')
        : search.trim()
    if (!dest) return 'Select at least one destination from Pakistan explorer.'
    if (!form.startDate || !form.endDate) return 'Choose start and end dates.'
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return 'End date must be on or after start date.'
    }
    if (days < 1) return 'Trip must be at least 1 day.'
    if (form.travelers < 1) return 'At least 1 traveler is required.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const destination =
      selectedDestinations.length > 0
        ? selectedDestinations.map((d) => d.name).join(', ')
        : search.trim()

    const payload = {
      destination,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: parseInt(form.budget, 10) || suggestedEstimate?.total || 0,
      travelers: form.travelers,
      tripType: form.tripType,
    }

    setSubmitting(true)
    try {
      const created = await tripService.createTrip(payload)

      localStorage.setItem('tripData', JSON.stringify({ ...payload, days, id: created?.id }))
      localStorage.setItem('selectedDestinations', JSON.stringify(selectedDestinations))

      const costForm = {
        origin: form.origin,
        destination: primaryDestination.split(',')[0].trim(),
        days,
        travelers: form.travelers,
        hotelTierId: estimatorDraft?.hotelTierId || 'standard',
        transportModeId: estimatorDraft?.transportModeId || 'bus',
        foodLevelId: estimatorDraft?.foodLevelId || 'standard',
        activityIds: estimatorDraft?.activityIds || ['sightseeing', 'local_tour'],
      }
      const estimate = calculateTripCost(costForm)
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(costForm))
      localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(estimate))
      localStorage.setItem(
        STORAGE_KEYS.BUDGET,
        JSON.stringify({
          maxBudget: payload.budget,
          estimatedCost: estimate.total,
          breakdown: estimate.breakdown,
          destination,
          origin: form.origin,
          updatedAt: new Date().toISOString(),
        })
      )

      navigate('/trip-overview', {
        state: {
          budgetData: {
            maxBudget: payload.budget,
            estimatedCost: estimate.total,
            breakdown: estimate.breakdown,
            destination,
          },
          tripCreated: true,
        },
      })
    } catch (err) {
      setError(err?.message || 'Could not create trip. Make sure you are logged in.')
    } finally {
      setSubmitting(false)
    }
  }

  const destIcon = (type) => {
    const map = { Beach: '🏖️', Mountain: '⛰️', City: '🏙️', Desert: '🏜️', Culture: '🏛️', Adventure: '🎿' }
    return map[type] || '🌍'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <div className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          <BackToDashboardButton />
          <div className="mt-8">
            <p className="text-violet-300 text-xs font-black uppercase tracking-[0.25em]">
              Plan my trip · Step 6
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-2">Create new trip</h1>
            <p className="text-slate-400 font-medium mt-3 max-w-2xl">
              Save your Pakistan journey with dates, travelers and budget. We sync it with your
              cost estimate, itinerary and trip overview.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
            {error && (
              <div className="rounded-2xl bg-rose-50 text-rose-800 px-4 py-3 text-sm font-bold ring-1 ring-rose-200">
                {error}
              </div>
            )}

            <section className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4">Destinations</h2>

              {selectedDestinations.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDestinations.map((dest) => (
                    <span
                      key={dest.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-50 text-violet-900 px-3 py-2 text-sm font-bold ring-1 ring-violet-100"
                    >
                      {destIcon(dest.type)} {dest.name}
                      <button
                        type="button"
                        onClick={() => removeDestination(dest.id)}
                        className="text-violet-600 hover:text-violet-900"
                        aria-label={`Remove ${dest.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => search && setShowDropdown(true)}
                  placeholder={
                    selectedDestinations.length
                      ? 'Add another destination…'
                      : 'Search Hunza, Lahore, Swat…'
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                {showDropdown && filteredDestinations.length > 0 && (
                  <ul className="absolute z-50 w-full mt-2 bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl max-h-64 overflow-y-auto">
                    {filteredDestinations.slice(0, 8).map((dest) => (
                      <li key={dest.id}>
                        <button
                          type="button"
                          onClick={() => addDestination(dest)}
                          className="w-full px-4 py-3 text-left hover:bg-violet-50 flex items-center gap-3 border-b border-slate-50 last:border-0"
                        >
                          <span className="text-xl">{destIcon(dest.type)}</span>
                          <div>
                            <p className="font-bold text-slate-900">{dest.name}</p>
                            <p className="text-xs text-slate-500">
                              {dest.type} · {dest.weather}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                No match?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/destination')}
                  className="text-violet-600 font-black hover:underline"
                >
                  Browse all destinations →
                </button>
              </p>
            </section>

            <section className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-black text-slate-500 uppercase">Origin city</label>
                <select
                  value={form.origin}
                  onChange={(e) => update({ origin: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold text-slate-900"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase">Start date</label>
                <input
                  type="date"
                  required
                  min={todayIso()}
                  value={form.startDate}
                  onChange={(e) => update({ startDate: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase">End date</label>
                <input
                  type="date"
                  required
                  min={form.startDate || todayIso()}
                  value={form.endDate}
                  onChange={(e) => update({ endDate: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
                />
              </div>

              {days > 0 && (
                <p className="sm:col-span-2 text-sm font-bold text-violet-600">
                  {days} day{days !== 1 ? 's' : ''} · {form.startDate} to {form.endDate}
                </p>
              )}

              <div>
                <label className="text-xs font-black text-slate-500 uppercase">Travelers</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.travelers}
                  onChange={(e) => update({ travelers: parseInt(e.target.value, 10) || 1 })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase">Budget (PKR)</label>
                <input
                  type="number"
                  min={5000}
                  step={1000}
                  value={form.budget}
                  onChange={(e) => update({ budget: e.target.value })}
                  placeholder={suggestedEstimate ? String(suggestedEstimate.total) : '100000'}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
                />
                {suggestedEstimate && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    Suggested from cost model: {formatPkr(suggestedEstimate.total)}
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4">Trip type</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TRIP_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update({ tripType: t.id })}
                    className={`rounded-2xl p-4 text-left ring-1 transition ${
                      form.tripType === t.id
                        ? 'bg-violet-600 text-white ring-violet-600'
                        : 'bg-slate-50 text-slate-800 ring-slate-100 hover:ring-violet-200'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <p className="font-black text-sm mt-2">{t.label}</p>
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-2xl px-6 py-3 font-black text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 min-w-[200px] rounded-2xl px-6 py-3 font-black text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-60"
              >
                {submitting ? 'Creating trip…' : 'Create trip & view overview'}
              </button>
            </div>
          </form>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 shadow-sm sticky top-6">
              <h3 className="font-black text-slate-900">Trip preview</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <span className="text-slate-500">To</span>
                  <p className="font-bold text-slate-900">
                    {primaryDestination || '—'}
                  </p>
                </li>
                <li>
                  <span className="text-slate-500">From</span>
                  <p className="font-bold text-slate-900">{form.origin}</p>
                </li>
                <li>
                  <span className="text-slate-500">Duration</span>
                  <p className="font-bold text-slate-900">
                    {days > 0 ? `${days} days` : 'Set dates'}
                  </p>
                </li>
                <li>
                  <span className="text-slate-500">Budget</span>
                  <p className="font-bold text-emerald-600">
                    {form.budget ? formatPkr(form.budget) : suggestedEstimate ? formatPkr(suggestedEstimate.total) : '—'}
                  </p>
                </li>
              </ul>

              {suggestedEstimate?.breakdown && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-500 uppercase mb-2">Estimate breakdown</p>
                  <ul className="space-y-1 text-xs">
                    {suggestedEstimate.breakdown.map((row) => (
                      <li key={row.key} className="flex justify-between font-bold">
                        <span>{row.icon} {row.label}</span>
                        <span>{formatPkr(row.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/cost-estimator')}
                  className="w-full rounded-xl py-2.5 text-sm font-black text-violet-700 bg-violet-50 hover:bg-violet-100"
                >
                  Open cost estimator
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/plan-my-trip')}
                  className="w-full rounded-xl py-2.5 text-sm font-black text-slate-600 bg-slate-50 hover:bg-slate-100"
                >
                  ← Plan my trip steps
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
