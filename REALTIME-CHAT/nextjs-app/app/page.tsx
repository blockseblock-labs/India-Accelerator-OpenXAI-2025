'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const lastChunkRef = useRef<string>("")

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // --- Helpers to reduce visible repetition from small models ---
  const squashImmediateRepeats = (text: string) => {
    // Collapse immediate duplicated words: "can can" -> "can"
    // Keep case-insensitive, avoid touching code blocks by keeping it light
    let cleaned = text.replace(/\b(\w+)(\s+\1\b)+/gi, '$1')
    // Collapse repeated punctuation "??", "..", "!!" (3+ to 2)
    cleaned = cleaned.replace(/([!?.,])\1{2,}/g, '$1$1')
    // Collapse triple spaces
    cleaned = cleaned.replace(/\s{3,}/g, '  ')
    return cleaned
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok || !response.body) throw new Error('Failed to get response')

      const reader = response.body.getReader()

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        
        if (value) {
          const raw = decoder.decode(value, { stream: true })
          const chunk = raw.replace(/\s+/g, ' ')
          if (!chunk.trim()) continue
          if (lastChunkRef.current === chunk) continue
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = squashImmediateRepeats(lastMessage.content + chunk)
            }
            return newMessages
          })
          lastChunkRef.current = chunk
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <div className="text-center text-white mb-8">
          <h1 className="text-6xl font-bold mb-4">💬 TextStream Template</h1>
          <p className="text-xl opacity-90">Real-time AI chat with streaming responses!</p>
        </div>
        
        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.length === 0 ? (
              <div className="text-center text-white/60 py-12">
                <Bot size={48} className="mx-auto mb-4" />
                <p>Start a conversation! Type a message below.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] md:max-w-3xl px-4 py-2 rounded-lg leading-relaxed break-words whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800/90 text-white backdrop-blur-sm'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {error && (
              <div className="text-center text-red-200 text-sm">{error}</div>
            )}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 bg-white/20 text-white placeholder-white/60 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 