function ModeSelector({ modes, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((m) => {
        const active = selected.includes(m.key)
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onToggle(m.key)}
            className={
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors " +
              (active
                ? "bg-amber-300 text-black border-amber-400 hover:bg-amber-200"
                : "bg-white text-black border-gray-200 hover:bg-gray-100")
            }
            aria-pressed={active}
          >
            <span className="text-lg" aria-hidden>
              {m.icon}
            </span>
            <span className="text-sm">{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ModeSelector
