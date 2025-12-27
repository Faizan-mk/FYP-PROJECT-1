import { useMemo, useState } from 'react'
import AddExpenseForm from './Components/AddExpenseForm'
import ExpenseTable from './Components/ExpenseTable'
import PlannedActualChart from './Components/PlannedActualChart'
import RemainingSummary from './Components/RemainingSummary'
import ExportButtons from './Components/ExportButtons'
import { useNavigate } from 'react-router-dom'
import BackToDashboardButton from '../../components/BackToDashboardButton'

export default function ExpenseTrackerPage() {
  const navigate = useNavigate()
  const [plannedBudget, setPlannedBudget] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('plannedBudget') : null
    return saved ? Number(saved) : 120000
  })
  const [expenses, setExpenses] = useState([])
  const [filters, setFilters] = useState({ q: '', cat: 'All' })

  const addExpense = (e) => {
    setExpenses((prev) => [{ id: crypto.randomUUID(), ...e }, ...prev])
  }

  const onDelete = (id) => setExpenses((prev) => prev.filter((x) => x.id !== id))

  const actualSpent = useMemo(() => expenses.reduce((s, x) => s + Number(x.amount || 0), 0), [expenses])
  const remaining = useMemo(() => Math.max(0, Number(plannedBudget || 0) - actualSpent), [plannedBudget, actualSpent])

  const filtered = useMemo(() => {
    let list = expenses
    if (filters.cat && filters.cat !== 'All') list = list.filter((x) => x.category === filters.cat)
    if (filters.q.trim()) {
      const q = filters.q.toLowerCase()
      list = list.filter((x) => x.title.toLowerCase().includes(q))
    }
    return list
  }, [expenses, filters])

  const categories = ['Flights', 'Hotels', 'Food', 'Activities', 'Transport', 'Other']

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <BackToDashboardButton />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Expense Tracker</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">Monitor real-time spending.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm p-4 shadow-md">
              <AddExpenseForm categories={categories} onAdd={addExpense} />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 gap-3">
                <h2 className="text-lg font-semibold">Expenses</h2>
                <div className="flex items-center gap-2">
                  <input
                    value={filters.q}
                    onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                    className="rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 text-sm shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
                    placeholder="Search title..."
                  />
                  <select
                    value={filters.cat}
                    onChange={(e) => setFilters((f) => ({ ...f, cat: e.target.value }))}
                    className="rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 text-sm shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
                  >
                    {['All', ...categories].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ExpenseTable items={filtered} onDelete={onDelete} />
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <RemainingSummary
              planned={plannedBudget}
              actual={actualSpent}
              remaining={remaining}
              onChangePlanned={(val) => {
                const n = Number(val) || 0
                setPlannedBudget(n)
                if (typeof window !== 'undefined') localStorage.setItem('plannedBudget', String(n))
              }}
            />

            <PlannedActualChart planned={plannedBudget} actual={actualSpent} />

            <ExportButtons onExportCSV={() => alert('CSV exported (demo)')} onExportPDF={() => alert('PDF exported (demo)')} />

            <div className="grid grid-cols-2 gap-3">
              <button
                className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
                onClick={() => navigate('/weather')}
              >
                Back
              </button>
              <button
                className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-indigo-700"
                onClick={() => navigate('/chatbot')}
              >
                Next
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
