export default function ExportButtons({ onExportCSV, onExportPDF }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-md backdrop-blur-sm">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">Tools</span>
        <span>Export</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onExportCSV}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.99] transition"
        >
          <span>📄</span>
          <span>CSV</span>
        </button>
        <button
          onClick={onExportPDF}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.99] transition"
        >
          <span>📄</span>
          <span>PDF</span>
        </button>
      </div>
    </div>
  )
}
