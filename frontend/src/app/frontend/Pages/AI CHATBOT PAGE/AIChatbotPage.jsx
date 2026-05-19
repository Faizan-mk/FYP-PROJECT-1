import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiClock, FiX, FiMessageCircle, FiMap } from 'react-icons/fi'
import ChatWindow from './Components/ChatWindow'
import ChatInput from './Components/ChatInput'
import Suggestions from './Components/Suggestions'
import QuickLinks from './Components/QuickLinks'
import BackToDashboardButton from '../../components/BackToDashboardButton'
import { chatService } from '../../src/services/api'

const STATS = [
  { value: '26K+', label: 'Travel answers' },
  { value: 'Live', label: 'Guide replies' },
  { value: 'Global', label: 'Destinations' },
]

export default function AIChatbotPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const endRef = useRef(null)
  const sidebarRef = useRef(null)
  const [typing, setTyping] = useState(false)
  const [chatSessions, setChatSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHistory && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const toggle = event.target.closest('[data-history-toggle]')
        if (!toggle) setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showHistory])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await chatService.getChatHistory()
        if (history?.length > 0) {
          const sessions = groupChatIntoSessions(history)
          setChatSessions(sessions)
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      }
    }
    fetchHistory()
  }, [])

  const groupChatIntoSessions = (history) => {
    const sessions = []
    let currentSession = []
    let sessionId = 1
    history.forEach((chat, index) => {
      currentSession.push(chat)
      if (currentSession.length >= 10 || index === history.length - 1) {
        sessions.push({
          id: sessionId++,
          chats: [...currentSession],
          timestamp: currentSession[0].createdAt || new Date().toISOString(),
          preview: `${currentSession[0].message.substring(0, 48)}…`,
        })
        currentSession = []
      }
    })
    return sessions.reverse()
  }

  const loadSession = (session) => {
    const formattedHistory = session.chats.flatMap((chat) => [
      { id: `u-${chat.id}`, role: 'user', text: chat.message },
      { id: `a-${chat.id}`, role: 'ai', text: chat.response },
    ])
    setMessages(formattedHistory)
    setCurrentSessionId(session.id)
    setShowHistory(false)
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentSessionId(null)
    setShowHistory(false)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const buildChatContext = (history) =>
    history
      .filter((m) => m.role === 'user' || m.role === 'ai')
      .slice(-10)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        text: m.text,
      }))

  const onSend = async (text) => {
    if (!text.trim()) return
    const cleanText = text.trim()
    const userMsg = { id: crypto.randomUUID(), role: 'user', text: cleanText }
    setMessages((m) => [...m, userMsg])
    setTyping(true)

    try {
      const priorTurns = buildChatContext(messages)
      const data = await chatService.sendMessage(cleanText, priorTurns)
      const replyText = data?.message || 'Sorry, I could not understand that.'
      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: replyText,
        itinerary: data?.itinerary || null,
        itineraryMeta: data?.itineraryMeta || null,
      }
      setMessages((m) => [...m, aiMsg])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: 'Could not reach the travel guide. Start the Python chatbot (`python app.py`) and Node backend, then try again.',
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const suggestionItems = useMemo(
    () => [
      '5 day itinerary for Hunza',
      '3 days in Lahore plan',
      'Best hotels in Hunza?',
      'Dubai trip budget from Pakistan',
      'Weather in Skardu',
      'Flights Islamabad to Karachi',
      'Things to do in Istanbul',
      'What to eat in Lahore?',
    ],
    []
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-20 w-[480px] h-[480px] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-indigo-600/25 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] rounded-full bg-amber-500/15 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-200 ring-1 ring-white/10 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Online · AI Travel Guide
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white via-violet-100 to-indigo-200 bg-clip-text text-transparent">
                  Plan smarter,
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                  travel better
                </span>
              </h1>
             
              <div className="flex flex-wrap gap-2">
                {STATS.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-baseline gap-1 rounded-lg bg-white/5 px-3 py-1.5 ring-1 ring-white/10 text-sm"
                  >
                    <span className="font-black text-white">{s.value}</span>
                    <span className="text-slate-400 text-xs">{s.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:pt-2">
              <BackToDashboardButton />
              <button
                type="button"
                onClick={startNewChat}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-lg hover:bg-violet-50 transition"
              >
                <FiPlus className="w-4 h-4" />
                New chat
              </button>
              <button
                type="button"
                data-history-toggle
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-black font-semibold text-sm ring-1 ring-white/15 hover:bg-white/15 backdrop-blur transition"
              >
                <FiClock className="w-4 h-4" />
                History
              </button>
            </div>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-5"
        >
          <QuickLinks onOpen={(path) => navigate(path)} />
        </motion.section>

        <div className="flex gap-4 lg:gap-6 relative">
          <AnimatePresence>
            {showHistory && (
              <motion.aside
                ref={sidebarRef}
                initial={{ opacity: 0, x: -24, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -24, width: 0 }}
                className="w-72 sm:w-80 shrink-0 overflow-hidden"
              >
                <div className="h-full min-h-[72vh] rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <FiMessageCircle className="text-violet-600" />
                      Chat history
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowHistory(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {chatSessions.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-12">No previous chats yet</p>
                    ) : (
                      chatSessions.map((session) => (
                        <button
                          key={session.id}
                          type="button"
                          onClick={() => loadSession(session)}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            currentSessionId === session.id
                              ? 'bg-violet-100 ring-2 ring-violet-400/50'
                              : 'bg-slate-50 hover:bg-slate-100 ring-1 ring-slate-200/80'
                          }`}
                        >
                          <p className="text-sm font-semibold text-slate-800 truncate">{session.preview}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(session.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-[10px] font-bold text-violet-600 mt-1">
                            {session.chats.length} messages
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main chat card */}
          <div className="flex-1 min-w-0">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10 bg-white">
              {/* Chat toolbar */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-gradient-to-r from-slate-50 to-violet-50/80 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-md">
                    <FiMap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Travel Guide Chat</p>
                    <p className="text-[11px] text-slate-500">Itineraries · Hotels · Flights · Tips</p>
                  </div>
                </div>
                {typing && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 animate-pulse">
                    Typing…
                  </span>
                )}
              </div>

              <div className="px-3 sm:px-5 pt-4 pb-2 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.06),transparent_55%)]">
                <ChatWindow messages={messages} endRef={endRef} typing={typing} />
              </div>

              <div className="border-t border-slate-200/80 px-3 sm:px-5 py-4 bg-slate-50/90">
                <Suggestions items={suggestionItems} onPick={onSend} disabled={typing} />
                <div className="mt-4">
                  <ChatInput onSend={onSend} disabled={typing} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
