function ComparisonTable({ rows, onBook }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-600">
            <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">Mode</th>
            <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">Cost</th>
            <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">Time (hrs)</th>
            <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">Comfort</th>
            <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">Eco</th>
            <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">Book</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r.mode.key} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">
                <div className="inline-flex items-center gap-2">
                  <span className="text-lg" aria-hidden>{r.mode.icon}</span>
                  <span className="font-medium">{r.mode.label}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-gray-700">PKR {typeof r.cost === 'number' ? r.cost.toLocaleString() : r.cost}</td>
              <td className="px-3 py-2 text-gray-700">{r.time}</td>
              <td className="px-3 py-2 text-gray-700">{r.comfort}/5</td>
              <td className="px-3 py-2 text-gray-700">{r.eco}/5</td>
              <td className="px-3 py-2 text-gray-700">
                <button
                  type="button"
                  disabled={!r.bookingUrl}
                  onClick={() => onBook && onBook(r)}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-black shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-600"
                >
                  Book
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-gray-400" colSpan={6}>No modes selected</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTable

