const LINKS = [
  { label: 'Destinations', path: '/destination', icon: '🗺️', color: 'from-emerald-500/10 to-teal-500/10 ring-emerald-200/60' },
  { label: 'Flights', path: '/traveler/flights', icon: '✈️', color: 'from-sky-500/10 to-blue-500/10 ring-sky-200/60' },
  { label: 'Hotels', path: '/traveler/hotels', icon: '🏨', color: 'from-amber-500/10 to-orange-500/10 ring-amber-200/60' },
  { label: 'Transport', path: '/transport', icon: '🚌', color: 'from-violet-500/10 to-purple-500/10 ring-violet-200/60' },
  { label: 'Budget', path: '/budget-planner', icon: '📊', color: 'from-rose-500/10 to-pink-500/10 ring-rose-200/60' },
  { label: 'Weather', path: '/weather', icon: '☁️', color: 'from-cyan-500/10 to-indigo-500/10 ring-cyan-200/60' },
  { label: 'Create trip', path: '/create-trip', icon: '📋', color: 'from-indigo-500/10 to-violet-500/10 ring-indigo-200/60' },
]

export default function QuickLinks({ onOpen }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
      {LINKS.map((link) => (
        <button
          key={link.path}
          type="button"
          onClick={() => onOpen?.(link.path)}
          className={`flex flex-col items-center gap-1.5 rounded-xl bg-gradient-to-br ${link.color} px-2 py-3 ring-1 hover:scale-[1.02] hover:shadow-md transition-all`}
        >
          <span className="text-xl sm:text-2xl" aria-hidden>
            {link.icon}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-700 text-center leading-tight">
            {link.label}
          </span>
        </button>
      ))}
    </div>
  )
}
