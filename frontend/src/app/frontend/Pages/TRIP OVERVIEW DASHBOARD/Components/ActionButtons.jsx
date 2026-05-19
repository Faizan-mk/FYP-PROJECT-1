export default function ActionButtons({ onEdit, onBudget, onShare }) {
  return (
    <div className="bg-white rounded-[2rem] ring-1 ring-slate-100 p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-900 mb-4">Actions</h2>
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-100 text-amber-950 px-4 py-3 text-sm font-black ring-1 ring-amber-200 hover:bg-amber-200 transition"
        >
          <span>✏️</span>
          <span>Edit trip</span>
        </button>
        <button
          type="button"
          onClick={onBudget}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-blue-900 px-4 py-3 text-sm font-black ring-amber-500 hover:bg-violet-500 transition"
        >
          <span>📊</span>
          <span >Adjust budget</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-100 text-emerald-950 px-4 py-3 text-sm font-black ring-1 ring-emerald-200 hover:bg-emerald-200 transition"
        >
          <span>📤</span>
          <span>Share plan</span>
        </button>
      </div>
    </div>
  )
}
