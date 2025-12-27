import { useEffect, useRef, useState } from 'react'

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      recRef.current = new SR()
      recRef.current.lang = 'en-US'
      recRef.current.onresult = (e) => {
        const t = Array.from(e.results).map((r) => r[0].transcript).join(' ')
        setText((prev) => (prev ? prev + ' ' : '') + t)
      }
      recRef.current.onend = () => setListening(false)
    }
  }, [])

  const send = () => {
    if (!text.trim()) return
    onSend?.(text)
    setText('')
  }

  const toggleVoice = () => {
    if (!recRef.current) {
      alert('Voice input not supported in this browser')
      return
    }
    if (listening) {
      recRef.current.stop()
      setListening(false)
    } else {
      recRef.current.start()
      setListening(true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleVoice}
        className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 transition ${listening ? 'bg-rose-100 text-rose-700 ring-rose-200 hover:shadow-md' : 'bg-gray-100 text-gray-800 ring-gray-200 hover:shadow-md'}`}
        title="Voice input"
      >
        {listening ? '🎙️' : '🎤'}
      </button>
      <div className="flex-1 rounded-2xl p-[2px] bg-gradient-to-r from-indigo-100 to-purple-100">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="w-full rounded-[14px] border border-transparent bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
        />
      </div>
      <button
        onClick={send}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-black font-semibold shadow-sm hover:shadow-md active:translate-y-px transition disabled:opacity-50"
        disabled={!text.trim()}
      >
        <span className="inline-grid place-items-center w-6 h-6 rounded-md bg-white/20">➤</span>
        <span>Send</span>
      </button>
    </div>
  )
}
