export default function BudgetSlider({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value || 0))}
            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-right"
          />
          <span className="text-sm text-gray-600">%</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
    </div>
  )
}
