export default function Suggestions({ items = [], onPick }) {
  if (!items.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <button
          key={i}
          onClick={() => onPick?.(s)}
          className="inline-flex items-center justify-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-200 ring-1 ring-gray-200"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
