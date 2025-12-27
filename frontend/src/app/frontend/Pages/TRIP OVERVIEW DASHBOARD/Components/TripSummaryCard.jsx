const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'PKR 0'
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(amount).replace('PKR', 'PKR ')
}

export default function TripSummaryCard({ data }) {
  const { 
    destination = 'Not specified', 
    dates = 'Not specified',
    days = 0,
    cost = 'PKR 0', 
    mode = 'Not specified',
    travelers = 1,
    budget = 'PKR 0',
    budgetBreakdown = []
  } = data || {}
  
  const hasBudgetBreakdown = budgetBreakdown && budgetBreakdown.length > 0
  
  return (
    <section className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold tracking-tight">Trip Summary</h2>
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
          <span>📋</span>
          <span>Overview</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Destination</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700">🗺️</span>
            <span className="truncate">{destination}</span>
          </div>
        </div>
        
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500">Dates</div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-amber-100 text-amber-700">📅</span>
            <span>{dates}</span>
          </div>
        </div>
        
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500">Estimated Cost</div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700">💰</span>
            <span>{cost}</span>
          </div>
        </div>
        
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500">Travel Mode</div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-sky-100 text-sky-700">✈️</span>
            <span className="truncate">{mode}</span>
          </div>
        </div>
        
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500">Travelers</div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-purple-100 text-purple-700">👥</span>
            <span>{travelers} {travelers === 1 ? 'person' : 'people'}</span>
          </div>
        </div>
        
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500">Trip Duration</div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-amber-100 text-amber-700">⏱️</span>
            <span>{days} {days === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
        
        <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow transition">
          <div className="text-xs text-gray-500">Total Budget</div>
          <div className="mt-1 flex items-center gap-2 text-base font-semibold">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-green-100 text-green-700">💵</span>
            <span>{budget}</span>
          </div>
        </div>
      </div>
      
      {hasBudgetBreakdown && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Budget Breakdown</h3>
          <div className="space-y-2">
            {budgetBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-gray-500">{item.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
