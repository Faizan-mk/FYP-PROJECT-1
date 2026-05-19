import { motion, AnimatePresence } from 'framer-motion'
import { FiCompass } from 'react-icons/fi'
import ChatItineraryBlock from './ChatItineraryBlock'
import ChatMessageText from './ChatMessageText'

function GuideAvatar() {
  return (
    <div
      className="shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 shadow-lg shadow-orange-500/25 flex items-center justify-center ring-2 ring-white"
    >
      <FiCompass className="w-[45%] h-[45%] text-white" strokeWidth={2.5} />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30 flex items-center justify-center ring-2 ring-white text-white text-[10px] font-bold">
      You
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 justify-start">
      <GuideAvatar />
      <div className="rounded-2xl rounded-bl-md bg-white/90 backdrop-blur px-4 py-3 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400"
              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          <span className="ml-2 text-xs font-medium text-slate-500">Planning your answer…</span>
        </div>
      </div>
    </div>
  )
}

export default function ChatWindow({ messages = [], endRef, typing = false }) {
  const isEmpty = messages.length === 0 && !typing

  return (
    <div className="space-y-4 overflow-y-auto max-h-[min(58vh,620px)] min-h-[320px] px-1 py-2 pr-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(99,102,241,0.3)_transparent]">
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-lg mb-4">
            <FiCompass className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-slate-600">Ask anything — like ChatGPT</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Travel, general questions, homework — or pick a suggestion below
          </p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {messages.map((m, idx) => {
          const isUser = m.role === 'user'
          const hasItinerary = m.itinerary?.length > 0

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.15) }}
              className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && <GuideAvatar />}

              <div
                className={
                  isUser
                    ? 'max-w-[82%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-4 py-3 shadow-lg shadow-indigo-500/20'
                    : hasItinerary
                      ? 'max-w-[95%] rounded-2xl rounded-bl-md bg-white px-4 py-4 shadow-md ring-1 ring-violet-200/80'
                      : 'max-w-[82%] sm:max-w-[78%] rounded-2xl rounded-bl-md bg-white/95 backdrop-blur px-4 py-3 shadow-sm ring-1 ring-slate-200/90'
                }
              >
                {hasItinerary && (
                  <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
                    Day-by-day itinerary
                  </span>
                )}
                <ChatMessageText
                  text={m.text}
                  className={`whitespace-pre-wrap text-sm leading-relaxed block ${
                    isUser ? 'text-white [&_strong]:text-white' : 'text-slate-700'
                  }`}
                />
                {hasItinerary && (
                  <ChatItineraryBlock itinerary={m.itinerary} meta={m.itineraryMeta || {}} />
                )}
              </div>

              {isUser && <UserAvatar />}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {typing && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  )
}
