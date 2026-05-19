import { useState } from 'react'
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi'
import { useVoiceInput } from '../../../hooks/useVoiceInput'

export default function ChatInput({ onSend, disabled = false }) {
  const [text, setText] = useState('')
  const { listening, toggleVoice } = useVoiceInput({ text, setText })

  const send = () => {
    if (!text.trim() || disabled) return
    onSend?.(text)
    setText('')
  }

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      <button
        type="button"
        onClick={toggleVoice}
        disabled={disabled}
        className={`shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
          listening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-300'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 ring-1 ring-slate-200'
        } disabled:opacity-50`}
        title="Voice input"
      >
        {listening ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
      </button>

      <div className="flex-1 relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-purple-500/20 blur-sm" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about trips, hotels, or type “5 day itinerary Hunza”…"
          disabled={disabled}
          className="relative w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200/60 shadow-sm disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
        />
      </div>

      <button
        type="button"
        onClick={send}
        disabled={!text.trim() || disabled}
        className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none"
      >
        <FiSend className="w-4 h-4" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </div>
  )
}
