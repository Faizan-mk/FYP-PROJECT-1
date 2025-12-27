export default function ChatWindow({ messages = [], endRef, typing = false }) {
  return (
    <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {messages.map((m) => (
        <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {m.role !== 'user' && (
            <div className="shrink-0 inline-grid place-items-center w-8 h-8 rounded-full bg-amber-100 ring-1 ring-amber-200">🤖</div>
          )}
          <div
            className={
              m.role === 'user'
                ? 'max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-500 to-purple-600 text-black px-4 py-2 shadow-md animate-[fadeIn_150ms_ease-out] leading-tight'
                : 'max-w-[75%] rounded-2xl rounded-bl-md bg-white text-gray-900 px-4 py-2 shadow-sm ring-1 ring-gray-200 animate-[fadeIn_150ms_ease-out] leading-tight'
            }
          >
            {m.text}
          </div>
          {m.role === 'user' && (
            <div className="shrink-0 inline-grid place-items-center w-8 h-8 rounded-full bg-indigo-100 ring-1 ring-indigo-200">🙋</div>
          )}
        </div>
      ))}
      {typing && (
        <div className="flex items-end gap-2 justify-start">
          <div className="shrink-0 inline-grid place-items-center w-8 h-8 rounded-full bg-amber-100 ring-1 ring-amber-200">🤖</div>
          <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-1.5 text-gray-600 shadow-sm ring-1 ring-gray-200">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 opacity-60"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 opacity-40"></span>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}
