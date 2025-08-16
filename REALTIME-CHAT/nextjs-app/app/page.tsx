'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, Copy, Download, Moon, Sun, MessageSquare, Sparkles, Clock } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [chatTheme, setChatTheme] = useState<'cosmic' | 'ocean' | 'sunset'>('cosmic')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const themeStyles = {
    cosmic: {
      bg: 'from-indigo-900 via-purple-900 to-pink-900',
      accent: 'from-blue-400 to-purple-500',
      particle1: 'bg-blue-500',
      particle2: 'bg-purple-500'
    },
    ocean: {
      bg: 'from-blue-900 via-cyan-800 to-teal-900',
      accent: 'from-cyan-400 to-blue-500',
      particle1: 'bg-cyan-500',
      particle2: 'bg-blue-500'
    },
    sunset: {
      bg: 'from-orange-900 via-red-800 to-pink-900',
      accent: 'from-orange-400 to-pink-500',
      particle1: 'bg-orange-500',
      particle2: 'bg-pink-500'
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        setMessages(prev => prev.map((msg, index) => 
          index === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
        ))
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([])
    inputRef.current?.focus()
  }

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const exportChat = () => {
    const chatData = messages.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n')
    
    const blob = new Blob([chatData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedPrompts = [
    "🤖 What is artificial intelligence?",
    "📚 Explain machine learning basics", 
    "🐍 Write a Python hello world",
    "🌐 Tell me about web development",
    "🚀 Future of technology",
    "💡 Creative project ideas"
  ]

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      darkMode 
        ? `bg-gradient-to-br ${themeStyles[chatTheme].bg}` 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse ${themeStyles[chatTheme].particle1}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse delay-1000 ${themeStyles[chatTheme].particle2}`}></div>
        <div className={`absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-10 blur-2xl animate-bounce delay-500 ${themeStyles[chatTheme].particle1}`}></div>
        <div className={`absolute top-1/4 right-1/4 w-48 h-48 rounded-full opacity-10 blur-2xl animate-pulse delay-2000 ${themeStyles[chatTheme].particle2}`}></div>
      </div>

      {/* Compact Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-black/30 border-white/10' 
          : 'bg-white/30 border-gray-200/30'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Compact Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-r ${themeStyles[chatTheme].accent} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div>
                <h1 className={`text-xl font-bold bg-gradient-to-r ${themeStyles[chatTheme].accent} bg-clip-text text-transparent`}>
                  NEXUS AI
                </h1>
                <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Revolutionary Chat Experience
                </p>
              </div>
            </div>
            
            {/* Compact Controls */}
            <div className="flex items-center space-x-2">
              {/* Theme Selector */}
              <div className="flex space-x-1">
                {Object.keys(themeStyles).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setChatTheme(theme as any)}
                    className={`w-8 h-8 rounded-lg transition-all duration-300 hover:scale-110 ${
                      chatTheme === theme 
                        ? `bg-gradient-to-r ${themeStyles[theme as keyof typeof themeStyles].accent} shadow-md` 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  >
                    <div className="text-sm">
                      {theme === 'cosmic' ? '🌌' : theme === 'ocean' ? '🌊' : '🌅'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              {/* Action Buttons */}
              {messages.length > 0 && (
                <>
                  <button
                    onClick={exportChat}
                    className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-300 hover:scale-110"
                    title="Export Chat"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 pb-32 pt-4">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            {/* Central Animation */}
            <div className="relative mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${themeStyles[chatTheme].accent} rounded-2xl flex items-center justify-center shadow-2xl animate-bounce`}>
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
              <div className={`absolute -inset-4 bg-gradient-to-r ${themeStyles[chatTheme].accent} rounded-2xl opacity-20 blur-xl animate-pulse`}></div>
            </div>
            
            <h2 className={`text-4xl font-bold bg-gradient-to-r ${themeStyles[chatTheme].accent} bg-clip-text text-transparent mb-4`}>
              Welcome to the Future
            </h2>
            <p className={`text-lg leading-relaxed mb-8 max-w-2xl ${
              darkMode ? 'text-white/80' : 'text-gray-700'
            }`}>
              Experience AI chat like never before. Click a suggestion or start typing below.
            </p>
            
            {/* Prompt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className={`group p-4 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    darkMode 
                      ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white' 
                      : 'border-gray-300/50 bg-white/60 hover:bg-white/80 text-gray-800'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${themeStyles[chatTheme].accent} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{prompt}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="space-y-6 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 group ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-green-400 to-blue-500'
                    : `bg-gradient-to-r ${themeStyles[chatTheme].accent}`
                }`}>
                  {message.role === 'user' ? 
                    <User className="w-5 h-5 text-white" /> : 
                    <Bot className="w-5 h-5 text-white" />
                  }
                </div>
                
                <div className={`flex-1 max-w-3xl ${
                  message.role === 'user' ? 'flex flex-col items-end' : ''
                }`}>
                  {/* Message Bubble */}
                  <div className={`relative group/msg rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.role === 'user'
                      ? darkMode 
                        ? `bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white` 
                        : `bg-gradient-to-r from-blue-500 to-purple-500 text-white`
                      : darkMode 
                        ? 'bg-black/40 backdrop-blur-sm text-white border border-white/20' 
                        : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200/50'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {message.content}
                    </pre>
                    
                    {/* Copy Button */}
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-white/20 hover:bg-white/30 opacity-0 group-hover/msg:opacity-100 transition-all duration-300"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Timestamp */}
                  {message.timestamp && (
                    <div className={`flex items-center space-x-1 mt-1 px-2 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <Clock className="w-3 h-3 opacity-50" />
                      <span className="text-xs opacity-50">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Animation */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${themeStyles[chatTheme].accent} flex items-center justify-center shadow-lg`}>
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                  darkMode ? 'bg-black/40 backdrop-blur-sm border border-white/20' : 'bg-white/90 backdrop-blur-sm border border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeStyles[chatTheme].accent} animate-bounce`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Fixed Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl border-t transition-all duration-300 ${
        darkMode 
          ? 'bg-black/30 border-white/10' 
          : 'bg-white/30 border-gray-200/50'
      }`}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <div className={`relative rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm border transition-all duration-300 focus-within:shadow-xl ${
              darkMode 
                ? 'bg-black/50 border-white/20 focus-within:border-white/40' 
                : 'bg-white/90 border-gray-300/50 focus-within:border-gray-400'
            }`}>
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send)"
                className={`w-full resize-none bg-transparent px-4 py-3 pr-16 text-sm focus:outline-none ${
                  darkMode 
                    ? 'text-white placeholder-white/50' 
                    : 'text-gray-900 placeholder-gray-500'
                }`}
                rows={Math.min(Math.max(inputMessage.split('\n').length, 1), 3)}
                disabled={isLoading}
                autoFocus
              />
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`absolute right-2 bottom-2 p-2 rounded-xl bg-gradient-to-r ${themeStyles[chatTheme].accent} text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}