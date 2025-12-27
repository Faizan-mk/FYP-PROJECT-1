export default function PlannedActualChart({ planned = 0, actual = 0 }) {
  const total = Math.max(planned, actual, 1)
  const plannedPct = Math.min(100, Math.round((planned / total) * 100))
  const actualPct = Math.min(100, Math.round((actual / total) * 100))

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-md backdrop-blur-sm">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">Chart</span>
        <span>Planned vs. Actual</span>
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Planned</span>
            <span>{planned.toLocaleString()}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden ring-1 ring-gray-200">
            <div className="h-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full" style={{ width: `${plannedPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Actual</span>
            <span>{actual.toLocaleString()}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden ring-1 ring-gray-200">
            <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${actualPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

