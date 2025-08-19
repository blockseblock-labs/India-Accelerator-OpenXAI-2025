'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Code, FileText, GraduationCap, BarChart3, Lightbulb, Mic, MicOff, Settings, Zap, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  mode?: string
  timestamp?: Date
  responseTime?: number
}

type AIMode = 'general' | 'code' | 'content' | 'study' | 'data' | 'creative'

const AI_MODES = {
  general: {
    name: 'General Chat',
    icon: Bot,
    color: 'from-blue-500 to-purple-600',
    description: 'General AI assistant for everyday questions',
    placeholder: 'Ask me anything...',
  },
  code: {
    name: 'Code Wizard',
    icon: Code,
    color: 'from-green-500 to-blue-600',
    description: 'Programming, debugging, and code optimization',
    placeholder: 'Describe your coding challenge...',
  },
  content: {
    name: 'Content Creator',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    description: 'Writing, editing, and content creation',
    placeholder: 'What content do you want to create?',
  },
  study: {
    name: 'Study Buddy',
    icon: GraduationCap,
    color: 'from-orange-500 to-red-600',
    description: 'Learning, explanations, and study assistance',
    placeholder: 'What would you like to learn?',
  },
  data: {
    name: 'Data Analyst',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
    description: 'Data analysis, insights, and visualization',
    placeholder: 'Ask about data analysis...',
  },
  creative: {
    name: 'Creative Lab',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-600',
    description: 'Brainstorming, ideation, and creative thinking',
    placeholder: 'Let\'s brainstorm something amazing...',
  }
}

export default function NexusAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentMode, setCurrentMode] = useState<AIMode>('general')
  const [isListening, setIsListening] = useState(false)
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [lastResponseTime, setLastResponseTime] = useState<number | null>(null)
  const [healthInfo, setHealthInfo] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check Ollama connection on component mount and periodically
  useEffect(() => {
    checkOllamaConnection()
    const interval = setInterval(checkOllamaConnection, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const checkOllamaConnection = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    
    try {
      setConnectionStatus('checking')
      const response = await fetch('/api/chat', {
        method: 'GET',
        signal: AbortSignal.timeout(8000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setHealthInfo(data)
        setConnectionStatus(data.status === 'healthy' ? 'connected' : 'disconnected')
        console.log('✅ Connection check:', data)
      } else {
        setConnectionStatus('disconnected')
        console.log('❌ API not responding:', response.status)
      }
    } catch (error) {
      setConnectionStatus('disconnected')
      console.log('❌ Connection check failed:', error)
    } finally {
      if (showRefresh) setIsRefreshing(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Check connection status
    if (connectionStatus === 'disconnected') {
      alert('Ollama is not running or TinyLlama model is not available. Please check the setup instructions.')
      return
    }

    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(),
      mode: currentMode,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    const startTime = Date.now()

    try {
      console.log(`🚀 Sending message to ${currentMode} mode:`, currentInput.substring(0, 50) + '...')
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          mode: currentMode,
        }),
        signal: AbortSignal.timeout(25000) // 25 second timeout
      })

      const responseTime = Date.now() - startTime
      setLastResponseTime(responseTime)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Response received in', responseTime + 'ms:', data)

      // Add AI response to messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message || 'No response received',
        mode: currentMode,
        timestamp: new Date(),
        responseTime: data.responseTime || responseTime
      }])

      // Refresh connection status after successful response
      checkOllamaConnection()

    } catch (error) {
      console.error('❌ Error sending message:', error)
      
      let errorMessage = 'Unknown error occurred'
      let suggestion = 'Please try again'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          errorMessage = 'Request timed out after 25 seconds'
          suggestion = 'TinyLlama is slow. Try a shorter message or check if Ollama is running properly'
        } else {
          errorMessage = error.message
        }
      }
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ **Error**: ${errorMessage}\n\n💡 **Suggestion**: ${suggestion}`,
        mode: currentMode,
        timestamp: new Date()
      }])

      // Check connection after error
      checkOllamaConnection()
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

  const toggleVoiceInput = () => {
    if (!isListening) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
        }
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.start()
      } else {
        alert('Speech recognition not supported in this browser')
      }
    } else {
      setIsListening(false)
    }
  }

  const currentModeConfig = AI_MODES[currentMode]
  const IconComponent = currentModeConfig.icon

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-red-500'
      case 'checking': return 'bg-yellow-500 animate-pulse'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Ollama Connected'
      case 'disconnected': return 'Ollama Disconnected'
      case 'checking': return 'Checking...'
      default: return 'Unknown Status'
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="w-3 h-3" />
      case 'disconnected': return <AlertCircle className="w-3 h-3" />
      case 'checking': return <Clock className="w-3 h-3" />
      default: return <AlertCircle className="w-3 h-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${currentModeConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  NEXUS AI
                </h1>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-500">{currentModeConfig.name}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                    {getConnectionIcon()}
                    <span className="text-xs text-gray-400">{getConnectionStatusText()}</span>
                  </div>
                  {lastResponseTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{lastResponseTime}ms</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => checkOllamaConnection(true)}
                disabled={isRefreshing}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                title="Check Ollama connection"
              >
                {isRefreshing ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                <span>Refresh Status</span>
              </button>
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Switch Mode</span>
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Selector */}
      {showModeSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your AI Mode</h2>
              <p className="text-gray-600 mt-1">Select the specialized AI assistant for your task</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(AI_MODES).map(([key, mode]) => {
                const Icon = mode.icon
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentMode(key as AIMode)
                      setShowModeSelector(false)
                    }}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      currentMode === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${mode.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{mode.name}</h3>
                    <p className="text-sm text-gray-600">{mode.description}</p>
                  </button>
                )
              })}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModeSelector(false)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-88px)]">
        {/* Mode Banner */}
        <div className={`mx-6 mt-6 p-4 bg-gradient-to-r ${currentModeConfig.color} rounded-xl text-white`}>
          <div className="flex items-center space-x-3">
            <IconComponent className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">{currentModeConfig.name}</h3>
              <p className="text-sm opacity-90">{currentModeConfig.description}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={`w-20 h-20 bg-gradient-to-r ${currentModeConfig.color} rounded-full flex items-center justify-center mb-6 shadow-xl`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to {currentModeConfig.name}
              </h2>
              <p className="text-gray-600 max-w-md mb-6">
                {currentModeConfig.description}
              </p>
              
              {connectionStatus === 'disconnected' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-red-700 font-medium text-sm">Ollama Setup Required</p>
                  </div>
                  <div className="text-red-600 text-sm space-y-2">
                    <p>Please follow these steps:</p>
                    <div className="bg-red-100 p-3 rounded text-xs font-mono space-y-1">
                      <div>1. Start Ollama: <code className="bg-red-200 px-1 rounded">ollama serve</code></div>
                      <div>2. Pull TinyLlama: <code className="bg-red-200 px-1 rounded">ollama pull tinyllama:latest</code></div>
                      <div>3. Test model: <code className="bg-red-200 px-1 rounded">ollama run tinyllama:latest "Hello"</code></div>
                    </div>
                    {healthInfo && (
                      <p className="text-xs">
                        Available models: {healthInfo.models?.join(', ') || 'none'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {connectionStatus === 'connected' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-green-700 font-medium text-sm">Ready to Chat!</p>
                  </div>
                  <p className="text-green-600 text-xs">TinyLlama model is loaded and ready</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                <button 
                  onClick={() => setInput("What is the capital of France?")}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={connectionStatus === 'disconnected'}
                >
                  Geography Question
                </button>
                <button 
                  onClick={() => setInput("Explain photosynthesis simply")}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={connectionStatus === 'disconnected'}
                >
                  Science Question
                </button>
                <button 
                  onClick={() => setInput("Write a short poem about nature")}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={connectionStatus === 'disconnected'}
                >
                  Creative Writing
                </button>
                <button 
                  onClick={() => setInput("What is 25 + 37?")}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={connectionStatus === 'disconnected'}
                >
                  Math Question
                </button>
              </div>

              {connectionStatus === 'connected' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-lg text-sm">
                  {/* <p className="font-medium text-blue-800 mb-2">💡 Tips for TinyLlama:</p>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Keep questions short and specific</li>
                    <li>• First response may take 30-60 seconds</li>
                    <li>• Works best with factual questions</li>
                    <li>• Try simple creative tasks</li>
                  </ul> */}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : `bg-gradient-to-r ${AI_MODES[message.mode as AIMode]?.color || 'from-gray-400 to-gray-600'}`
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className={`max-w-3xl ${
                    message.role === 'user' ? 'ml-auto' : 'mr-auto'
                  }`}>
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content.split('**').map((part, i) => 
                          i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                        )}
                      </div>
                      <div className={`flex items-center justify-between mt-2 text-xs opacity-70 ${
                        message.role === 'user' ? 'text-white' : 'text-gray-500'
                      }`}>
                        <span>
                          {message.timestamp?.toLocaleTimeString()}
                        </span>
                        {message.responseTime && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{message.responseTime}ms</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentModeConfig.color} rounded-full flex items-center justify-center shadow-md`}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={connectionStatus === 'disconnected' ? 'Please start Ollama and install TinyLlama...' : currentModeConfig.placeholder}
                className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500"
                rows={1}
                disabled={isLoading || connectionStatus === 'disconnected'}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '48px';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>

            <button
              onClick={toggleVoiceInput}
              className={`p-3 rounded-xl transition-colors ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
              disabled={isLoading || connectionStatus === 'disconnected'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || connectionStatus === 'disconnected'}
              className={`p-3 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg ${
                !input.trim() || connectionStatus === 'disconnected'
                  ? 'bg-gray-300 text-gray-500' 
                  : `bg-gradient-to-r ${currentModeConfig.color} text-white hover:shadow-xl`
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Quick Actions */}
          {connectionStatus === 'connected' && messages.length === 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setInput("What is the capital of Japan?")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                disabled={isLoading}
              >
                Simple Question
              </button>
              <button
                onClick={() => setInput("Write a haiku about cats")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                disabled={isLoading}
              >
                Creative Task
              </button>
              <button
                onClick={() => setInput("Explain gravity in simple terms")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                disabled={isLoading}
              >
                Explain Something
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}