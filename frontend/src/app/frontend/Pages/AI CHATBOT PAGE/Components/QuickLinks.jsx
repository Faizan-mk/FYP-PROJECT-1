export default function QuickLinks({ onOpen }) {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <button onClick={() => onOpen?.('/trip-overview')} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 ring-1 ring-gray-200">Trip Overview</button>
      <button onClick={() => onOpen?.('/budget-planner')} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 ring-1 ring-gray-200">Budget</button>
      <button onClick={() => onOpen?.('/weather')} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 ring-1 ring-gray-200">Weather</button>
      <button onClick={() => onOpen?.('/expense-tracker')} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 ring-1 ring-gray-200">Expenses</button>
    </div>
  )
}
