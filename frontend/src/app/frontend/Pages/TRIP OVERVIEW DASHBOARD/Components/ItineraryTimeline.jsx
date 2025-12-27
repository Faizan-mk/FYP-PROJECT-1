export default function ItineraryTimeline({ days = [] }) {
  return (
    <ol className="relative ml-4">
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300" />
      {days.map((d, idx) => (
        <li key={idx} className="relative mb-6 pl-6">
          <span className="absolute -left-[11px] top-0 inline-grid place-items-center w-6 h-6 rounded-full bg-white ring-2 ring-indigo-300 text-[11px] font-semibold text-indigo-700 shadow-sm">
            {idx + 1}
          </span>
          <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight">{d.day}</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">Planned</span>
            </div>
            <ul className="mt-2 text-sm text-gray-700 space-y-1 list-disc pl-5">
              {(d.items || []).map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
