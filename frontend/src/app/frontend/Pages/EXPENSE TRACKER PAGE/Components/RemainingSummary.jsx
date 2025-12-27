export default function RemainingSummary({ planned = 0, actual = 0, remaining = 0, onChangePlanned }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/90 backdrop-blur-sm p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Summary</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">💸 Budget</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
          <div className="text-[11px] text-gray-500">Planned</div>
          <div className="text-lg font-extrabold tracking-tight text-gray-900">{Number(planned || 0).toLocaleString()}</div>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
          <div className="text-[11px] text-gray-500">Actual</div>
          <div className="text-lg font-extrabold tracking-tight text-gray-900">{Number(actual || 0).toLocaleString()}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
          <div className="text-[11px] text-emerald-700">Remaining</div>
          <div className="text-lg font-extrabold tracking-tight text-emerald-700">{Number(remaining || 0).toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-xs font-semibold mb-1 tracking-wide text-gray-700">Set Planned Budget</label>
        <input
          type="number"
          min={0}
          value={planned}
          onChange={(e) => onChangePlanned?.(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
        />
      </div>
    </div>
  )
}

