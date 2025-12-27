function FromToForm({ from, to, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>📍</span>
          <input
            value={from}
            onChange={(e) => onChange({ from: e.target.value, to })}
            placeholder="City A"
            className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>🎯</span>
          <input
            value={to}
            onChange={(e) => onChange({ from, to: e.target.value })}
            placeholder="City B"
            className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
          />
        </div>
      </div>
    </div>
  )
}

export default FromToForm
