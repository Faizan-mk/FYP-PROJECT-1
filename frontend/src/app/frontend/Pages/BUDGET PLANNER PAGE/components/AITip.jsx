export default function AITip({ tip }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden>🤖</span>
        <div>
          <div className="text-sm font-semibold text-emerald-700">AI Tip</div>
          <p className="text-sm text-emerald-800 mt-1">{tip}</p>
        </div>
      </div>
    </div>
  )
}
