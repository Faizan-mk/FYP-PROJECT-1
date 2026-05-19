const CATEGORIES = {
  itinerary: { icon: '🗓️', label: 'Itinerary' },
  hotels: { icon: '🏨', label: 'Hotels' },
  budget: { icon: '💰', label: 'Budget' },
  weather: { icon: '☀️', label: 'Weather' },
  default: { icon: '✈️', label: 'Ask' },
}

function pickCategory(text) {
  const t = text.toLowerCase()
  if (t.includes('itinerary') || t.includes('day') || t.includes('plan')) return 'itinerary'
  if (t.includes('hotel')) return 'hotels'
  if (t.includes('budget') || t.includes('cost')) return 'budget'
  if (t.includes('weather')) return 'weather'
  return 'default'
}

export default function Suggestions({ items = [], onPick, disabled = false }) {
  if (!items.length) return null

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-0.5">
        Quick questions
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((s, i) => {
          const cat = CATEGORIES[pickCategory(s)]
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onPick?.(s)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200/90 shadow-sm hover:ring-violet-300 hover:bg-violet-50 hover:text-violet-800 transition-all disabled:opacity-50"
            >
              <span className="text-sm opacity-80 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="max-w-[200px] sm:max-w-none truncate">{s}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
