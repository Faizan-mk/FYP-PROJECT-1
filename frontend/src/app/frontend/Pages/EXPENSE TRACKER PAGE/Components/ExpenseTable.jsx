export default function ExpenseTable({ items = [], onDelete }) {
  if (!items.length) {
    return (
      <div className="text-sm text-gray-600 rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50/50">No expenses yet. Add your first expense above.</div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/70">
          <tr className="text-left text-gray-600">
            <th className="py-3 pr-3 font-semibold">Title</th>
            <th className="py-3 pr-3 font-semibold">Category</th>
            <th className="py-3 pr-3 font-semibold">Amount</th>
            <th className="py-3 pr-3 font-semibold">Date</th>
            <th className="py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x, idx) => (
            <tr key={x.id} className={`${idx % 2 ? 'bg-white' : 'bg-gray-50/40'} border-t border-gray-200 hover:bg-indigo-50/40 transition-colors`}>
              <td className="py-3 pr-3 font-medium text-gray-900">{x.title}</td>
              <td className="py-3 pr-3">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">{x.category}</span>
              </td>
              <td className="py-3 pr-3">
                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">{Number(x.amount || 0).toLocaleString()}</span>
              </td>
              <td className="py-3 pr-3">{x.date}</td>
              <td className="py-3 pr-4 text-right">
                <button
                  onClick={() => onDelete?.(x.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-500/10 px-3 py-1.5 text-rose-700 font-semibold hover:bg-rose-600/10 hover:text-rose-800 ring-1 ring-rose-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

