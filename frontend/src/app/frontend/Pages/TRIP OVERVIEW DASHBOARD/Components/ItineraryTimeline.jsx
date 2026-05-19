export default function ItineraryTimeline({ days = [] }) {
  if (!days.length) {
    return (
      <p className="text-slate-500 text-sm font-medium text-center py-8">
        No itinerary yet. Create a trip with dates, pick destinations, and run the cost
        estimator to generate a full day-by-day plan.
      </p>
    )
  }

  return (
    <ol className="relative ml-1 space-y-0">
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-400 via-indigo-300 to-violet-200" />
      {days.map((d, idx) => (
        <li key={`${d.day}-${idx}`} className="relative pb-8 last:pb-0">
          <span className="absolute left-0 top-1 z-10 inline-grid place-items-center w-8 h-8 rounded-full bg-white ring-2 ring-violet-400 text-xs font-black text-violet-700 shadow-md">
            {idx + 1}
          </span>

          <div className="ml-12 rounded-2xl ring-1 ring-slate-100 bg-white overflow-hidden hover:ring-violet-200 transition shadow-sm">
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 border-b border-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{d.day}</h3>
                  {d.dateLabel && (
                    <p className="text-xs font-bold text-violet-600 mt-0.5">{d.dateLabel}</p>
                  )}
                </div>
                <div className="text-right">
                  {d.location && (
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      📍 {d.location}
                    </p>
                  )}
                  {d.theme && (
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-white text-violet-700 ring-1 ring-violet-100 font-black">
                      {d.theme}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ul className="p-4 space-y-3">
              {(d.items || []).map((it, i) => {
                const isRich = typeof it === 'object' && it !== null && 'title' in it
                if (!isRich) {
                  return (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-violet-500">•</span>
                      <span>{String(it)}</span>
                    </li>
                  )
                }
                return (
                  <li
                    key={i}
                    className="flex gap-3 text-sm border-l-2 border-violet-100 pl-3 py-0.5"
                  >
                    <div className="shrink-0 w-14 text-[11px] font-black text-slate-400 pt-0.5">
                      {it.time || '—'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span aria-hidden>{it.icon}</span>
                        {it.title}
                      </p>
                      {it.detail && (
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{it.detail}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
