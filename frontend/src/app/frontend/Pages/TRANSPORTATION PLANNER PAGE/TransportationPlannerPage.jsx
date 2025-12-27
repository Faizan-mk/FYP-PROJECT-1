import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FromToForm from './Components/FromToForm'
import ModeSelector from './Components/ModeSelector'
import ComparisonTable from './Components/ComparisonTable'
import AISuggestion from './Components/AISuggestion'
import BackToDashboardButton from '../../components/BackToDashboardButton'

const MODES = [
  { key: 'car', label: 'Car', icon: '🚗', bookingUrl: 'https://www.careem.com/' },
  { key: 'bus', label: 'Bus', icon: '🚌', bookingUrl: 'https://www.bookme.pk/bus-tickets' },
  { key: 'train', label: 'Train', icon: '🚆', bookingUrl: 'https://www.pakrail.gov.pk/' },
  { key: 'flight', label: 'Flight', icon: '✈️', bookingUrl: 'https://www.google.com/travel/flights' },
  { key: 'motorcycle', label: 'Motorcycle', icon: '🏍️', bookingUrl: 'https://www.inDrive.com/' },
]

function TransportationPlannerPage() {
  const [from, setFrom] = useState(() => {
    return localStorage.getItem('transportFrom') || '';
  });
  const [to, setTo] = useState(() => {
    return localStorage.getItem('transportTo') || '';
  });
  const [selectedModes, setSelectedModes] = useState(() => {
    const saved = localStorage.getItem('selectedTransportModes');
    return saved ? JSON.parse(saved) : MODES.map(m => m.key);
  });
  const [bookedOption, setBookedOption] = useState(() => {
    const saved = localStorage.getItem('bookedTransportOption');
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate()

  // Mock comparison logic. You can replace with real API later.
  const rows = useMemo(() => {
    // Simple scoring based on mode
    const base = {
      car: { cost: 2500, time: 3.5, comfort: 4, eco: 2 },
      bus: { cost: 900, time: 5.5, comfort: 2, eco: 4 },
      train: { cost: 1500, time: 4.5, comfort: 3, eco: 4 },
      flight: { cost: 18000, time: 1.2, comfort: 3, eco: 1 },
      motorcycle: { cost: 600, time: 2, comfort: 3, eco: 3 },
    }
    return MODES
      .filter(m => selectedModes.includes(m.key))
      .map(m => ({ mode: m, ...base[m.key], bookingUrl: m.bookingUrl }))
  }, [selectedModes])

  const bestForBudget = useMemo(() => {
    if (!rows.length) return null
    // Lowest cost wins; tie-breaker by time
    const sorted = [...rows].sort((a, b) => a.cost - b.cost || a.time - b.time)
    return sorted[0]?.mode
  }, [rows])

  const handleBook = (row) => {
    setBookedOption(row);
    localStorage.setItem('bookedTransportOption', JSON.stringify(row));
    if (row?.mode?.key === 'flight') {
      navigate('/flight-accommodation')
    } else if (row?.bookingUrl) {
      window.open(row.bookingUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSave = () => {
    // Save all transport data to localStorage
    localStorage.setItem('transportFrom', from);
    localStorage.setItem('transportTo', to);
    localStorage.setItem('selectedTransportModes', JSON.stringify(selectedModes));
    if (bookedOption) {
      localStorage.setItem('bookedTransportOption', JSON.stringify(bookedOption));
    }
    alert('Transport option saved!')
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 p-5 shadow-lg text-white flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span>🚗</span>
            <span>Transportation Planner</span>
          </h1>
          <p className="mt-1 text-sm text-white/90">Compare mode options by cost, time, comfort and eco to pick your best route.</p>
        </div>
        <BackToDashboardButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <FromToForm from={from} to={to} onChange={({ from: f, to: t }) => { 
              setFrom(f); 
              setTo(t);
              // Save immediately when from/to changes
              localStorage.setItem('transportFrom', f);
              localStorage.setItem('transportTo', t);
            }} />
            <div className="mt-4">
              <ModeSelector modes={MODES} selected={selectedModes} onToggle={(key) => {
                setSelectedModes(prev => {
                  const newModes = prev.includes(key) 
                    ? prev.filter(k => k !== key) 
                    : [...prev, key];
                  // Save immediately when modes change
                  localStorage.setItem('selectedTransportModes', JSON.stringify(newModes));
                  return newModes;
                });
              }} />
            </div>
          </div>

          <div className="mt-4">
            <ComparisonTable rows={rows} onBook={handleBook} />
            <div className="mt-4 flex items-center justify-between gap-3">
              <AISuggestion bestMode={bestForBudget} />
              <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 border border-amber-300 shadow">
                <span className="text-lg" aria-hidden>💾</span>
                <span className="font-medium">Save Transport Option</span>
              </button>
            </div>
          </div>

          {bookedOption && (
            <div className="mt-4 bg-white rounded-xl border border-green-200 shadow-sm p-4 text-sm text-gray-800">
              <h2 className="text-lg font-bold text-green-700 mb-1">Selected Transport Details</h2>
              <p className="text-xs text-gray-500 mb-3">You selected this option for booking. Final booking and payment are completed on the partner website.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>{bookedOption.mode.icon}</span>
                  <span className="font-semibold">{bookedOption.mode.label}</span>
                </div>
                <div>
                  <p className="font-semibold">Approx. Price</p>
                  <p>PKR {typeof bookedOption.cost === 'number' ? bookedOption.cost.toLocaleString() : bookedOption.cost}</p>
                </div>
                <div>
                  <p className="font-semibold">Estimated Time</p>
                  <p>{bookedOption.time} hours</p>
                </div>
                <div>
                  <p className="font-semibold">Route</p>
                  <p>{from || 'From ?'} → {to || 'To ?'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="md:col-span-1 space-y-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h2 className="font-medium mb-2">Tips</h2>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-600">
              <li>Toggle Car and Bus to compare comfort vs. price.</li>
              <li>Use Train for a balanced cost and more eco-friendly option.</li>
              <li>Flights are fastest but usually cost more.</li>
              <li>Motorcycles are quick for short city routes.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
          onClick={() => navigate('/flight-accommodation')}
        >
          Back
        </button>
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-indigo-700"
          onClick={() => navigate('/cost-estimator')}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TransportationPlannerPage
