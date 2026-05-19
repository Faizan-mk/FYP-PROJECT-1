import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiArrowRight } from 'react-icons/fi'
import ItineraryTimeline from '../../TRIP OVERVIEW DASHBOARD/Components/ItineraryTimeline'

export default function ChatItineraryBlock({ itinerary = [], meta = {} }) {
  const navigate = useNavigate()
  if (!itinerary?.length) return null

  const { days, destination, origin } = meta

  return (
    <div className="mt-4 pt-4 border-t border-violet-100 space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2.5 text-white shadow-md">
        <FiCalendar className="w-4 h-4 shrink-0 opacity-90" />
        <p className="text-xs font-bold">
          {days}-day plan · {destination}
          {origin ? ` · from ${origin}` : ''}
        </p>
      </div>
      <div className="max-h-[45vh] overflow-y-auto pr-1 rounded-xl bg-slate-50/80 p-2 ring-1 ring-slate-100">
        <ItineraryTimeline days={itinerary} />
      </div>
      <button
        type="button"
        onClick={() => {
          if (destination) {
            localStorage.setItem(
              'tripData',
              JSON.stringify({
                destination,
                days: days || itinerary.length,
                origin: origin || 'Islamabad',
              })
            )
          }
          navigate('/create-trip')
        }}
        className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 hover:brightness-105 transition"
      >
        Save & open Create Trip
        <FiArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
