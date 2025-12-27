export default function BudgetInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Total Budget</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          placeholder="Enter total budget"
        />
        <span className="text-sm text-gray-600 whitespace-nowrap">PKR</span>
      </div>
    </div>
  )
}
