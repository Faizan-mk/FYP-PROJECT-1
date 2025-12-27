export default function ActionButtons() {
  const onEdit = () => alert('Edit plan (to implement)')
  const onDownload = () => alert('Download PDF (to implement)')
  const onShare = () => alert('Share plan (to implement)')

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-3">Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onEdit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 to-amber-300 px-4 py-2.5 text-black font-semibold shadow-sm hover:shadow-md ring-1 ring-amber-300 hover:-translate-y-0.5 transition"
        >
          <span className="inline-grid place-items-center w-6 h-6 rounded-lg bg-amber-100">✏️</span>
          <span>Edit</span>
        </button>
        <button
          onClick={onDownload}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-black font-semibold shadow-sm hover:shadow-md ring-1 ring-indigo-300 hover:-translate-y-0.5 transition"
        >
          <span className="inline-grid place-items-center w-6 h-6 rounded-lg bg-white/20">⬇️</span>
          <span>Download PDF</span>
        </button>
        <button
          onClick={onShare}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 text-black font-semibold shadow-sm hover:shadow-md ring-1 ring-emerald-300 hover:-translate-y-0.5 transition"
        >
          <span className="inline-grid place-items-center w-6 h-6 rounded-lg bg-emerald-100">📤</span>
          <span>Share Plan</span>
        </button>
      </div>
    </div>
  )
}
