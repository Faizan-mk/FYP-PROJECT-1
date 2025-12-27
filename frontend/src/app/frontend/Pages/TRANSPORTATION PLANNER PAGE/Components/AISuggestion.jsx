function AISuggestion({ bestMode }) {
  const label = bestMode?.label || '—'
  const icon = bestMode?.icon || '🤖'
  return (
    <div className="flex items-center gap-2 text-sm bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg">
      <span className="text-base" aria-hidden>{icon}</span>
      <span>
        <strong className="font-semibold">AI Suggestion:</strong> Best option for your budget: {label}
      </span>
    </div>
  )
}

export default AISuggestion
