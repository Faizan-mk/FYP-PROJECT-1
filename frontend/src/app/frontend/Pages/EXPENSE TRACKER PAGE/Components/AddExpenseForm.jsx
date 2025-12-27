import { useState } from 'react'

export default function AddExpenseForm({ categories = [], onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0] || 'Other')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const canAdd = title.trim() && amount && date

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canAdd) return
    onAdd?.({ title: title.trim(), category, amount: Number(amount), date })
    setTitle('')
    setAmount('')
    setDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 tracking-wide text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 shadow-sm placeholder:text-gray-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
            placeholder="e.g., Museum tickets"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 tracking-wide text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 tracking-wide text-gray-700">Amount</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
            placeholder="0"
          />
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1 tracking-wide text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 bg-white/90 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={!canAdd}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:brightness-100"
        >
          Add Expense
        </button>
      </div>
    </form>
  )
}

