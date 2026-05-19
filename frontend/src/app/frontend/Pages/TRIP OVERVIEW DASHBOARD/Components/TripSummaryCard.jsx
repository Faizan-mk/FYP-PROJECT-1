import { formatPkr } from '../../../utils/tripCostCalculator'

export default function TripSummaryCard({ data }) {
  const {
    destination = 'Not specified',
    origin = 'Islamabad',
    dates = 'Not specified',
    days = 0,
    cost = 'PKR 0',
    mode = 'Not specified',
    travelers = 1,
    budget = 'PKR 0',
    status = 'planned',
    budgetBreakdown = [],
  } = data || {}

  const hasBudgetBreakdown = budgetBreakdown && budgetBreakdown.length > 0
  const statusText =
    status === 'ongoing' ? 'Active' : status === 'completed' ? 'Completed' : 'Planned'

  return (
    <section className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-slate-900">Trip summary</h2>
        <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-100">
          {statusText}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryTile icon="🗺️" label="Destination" value={destination} />
        <SummaryTile icon="📅" label="Dates" value={dates} />
        <SummaryTile icon="🏠" label="Origin" value={origin} />
        <SummaryTile icon="⏱️" label="Duration" value={`${days} ${days === 1 ? 'day' : 'days'}`} />
        <SummaryTile icon="👥" label="Travelers" value={`${travelers} ${travelers === 1 ? 'person' : 'people'}`} />
        <SummaryTile icon="🚌" label="Travel mode" value={mode} />
        <SummaryTile icon="💰" label="Estimated cost" value={cost} accent="text-emerald-600" />
        <SummaryTile icon="💵" label="Budget limit" value={budget} accent="text-violet-600" />
      </div>

      {hasBudgetBreakdown && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-black text-slate-700 mb-3">Cost breakdown</h3>
          <div className="space-y-2">
            {budgetBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-slate-600">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">
                    {typeof item.amount === 'number' ? formatPkr(item.amount) : item.amount}
                  </div>
                  <div className="text-xs text-slate-500">{item.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function SummaryTile({ icon, label, value, accent = 'text-slate-900' }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
      <div className={`mt-1 flex items-center gap-2 text-base font-black ${accent}`}>
        <span aria-hidden>{icon}</span>
        <span className="truncate">{value}</span>
      </div>
    </div>
  )
}
