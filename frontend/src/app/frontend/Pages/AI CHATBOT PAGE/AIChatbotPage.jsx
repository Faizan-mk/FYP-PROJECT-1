import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatWindow from './Components/ChatWindow'
import ChatInput from './Components/ChatInput'
import Suggestions from './Components/Suggestions'
import QuickLinks from './Components/QuickLinks'
import BackToDashboardButton from '../../components/BackToDashboardButton'
import { chatService } from '../../src/services/api'

export default function AIChatbotPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { id: 'sys-1', role: 'ai', text: 'Hi! I am your AI travel assistant. How can I help you today?' },
  ])
  const endRef = useRef(null)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await chatService.getChatHistory();
        if (history && history.length > 0) {
          const formattedHistory = history.flatMap(chat => [
            { id: `u-${chat.id}`, role: 'user', text: chat.message },
            { id: `a-${chat.id}`, role: 'ai', text: chat.response }
          ]);
          setMessages(prev => [...prev, ...formattedHistory]);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSend = async (text) => {
    if (!text.trim()) return
    const cleanText = text.trim()
    const userMsg = { id: crypto.randomUUID(), role: 'user', text: cleanText }
    setMessages((m) => [...m, userMsg])
    setTyping(true)

    try {
      const data = await chatService.sendMessage(cleanText)
      const replyText = data?.message || 'Sorry, I could not understand that.'

      const aiMsg = { id: crypto.randomUUID(), role: 'ai', text: replyText }
      setMessages((m) => [...m, aiMsg])
    } catch (err) {
      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: 'There was a problem talking to the travel assistant. Please make sure the backend server is running.',
      }
      setMessages((m) => [...m, aiMsg])
    } finally {
      setTyping(false)
    }
  }

  const suggestionItems = useMemo(
    () => [
      'Best hotels in Paris?',
      'Show weather forecast',
      'Make a 3-day itinerary',
      'Estimate my trip budget',
    ],
    []
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">AI Chatbot</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">Chat with AI for trip guidance.</p>
            </div>
            <BackToDashboardButton />
          </div>
          <QuickLinks onOpen={(path) => navigate(path)} />
        </div>

        <div className="grid grid-rows-[1fr_auto] rounded-2xl p-[2px] bg-gradient-to-r from-indigo-100 to-purple-100 shadow-md overflow-hidden min-h-[60vh]">
          <div className="rounded-[14px] border border-indigo-100 bg-white/80 backdrop-blur-sm ring-1 ring-indigo-100/50">
            <div className="p-4 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.05),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.05),transparent_35%)] rounded-t-[14px]">
              <ChatWindow messages={messages} endRef={endRef} typing={typing} />
            </div>
            <div className="border-t border-gray-200 p-4 bg-white/70">
              <Suggestions items={suggestionItems} onPick={(q) => onSend(q)} />
              <div className="mt-3">
                <ChatInput onSend={onSend} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
            onClick={() => navigate('/expense-tracker')}
          >
            Back
          </button>
          <button
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-indigo-700"
            onClick={() => navigate('/safety-emergency')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
