'use client'

import { useState, useEffect } from 'react'
import { Brain, MessageCircle, BarChart3, Heart, Sun, Cloud, CloudRain, Zap, Smile, Frown, Meh } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface MoodEntry {
  id: string
  mood: string
  intensity: number
  notes: string
  timestamp: Date
}

const moodIcons = {
  'Happy': Sun,
  'Sad': CloudRain,
  'Stressed': Zap,
  'Neutral': Cloud,
  'Excited': Smile,
  'Anxious': Frown,
  'Calm': Heart,
  'Tired': Meh
}

const moodColors = {
  'Happy': 'bg-yellow-100 text-yellow-800',
  'Sad': 'bg-blue-100 text-blue-800',
  'Stressed': 'bg-red-100 text-red-800',
  'Neutral': 'bg-gray-100 text-gray-800',
  'Excited': 'bg-orange-100 text-orange-800',
  'Anxious': 'bg-purple-100 text-purple-800',
  'Calm': 'bg-green-100 text-green-800',
  'Tired': 'bg-slate-100 text-slate-800'
}

export default function MindMate() {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentMood, setCurrentMood] = useState('')
  const [moodNotes, setMoodNotes] = useState('')
  const [moodIntensity, setMoodIntensity] = useState(5)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('mindmate-messages')
    const savedMoods = localStorage.getItem('mindmate-moods')
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    }
    
    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods).map((mood: any) => ({
        ...mood,
        timestamp: new Date(mood.timestamp)
      })))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mindmate-messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem('mindmate-moods', JSON.stringify(moodEntries))
  }, [moodEntries])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response')
      }
      
      const data = await response.json()
      const aiResponse = data.response
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate AI response - replace with actual Ollama API call
    const responses = [
      "I understand how you're feeling. It's completely normal to experience ups and downs. Would you like to talk more about what's on your mind?",
      "Thank you for sharing that with me. Remember, it's okay to not be okay sometimes. What would help you feel better right now?",
      "I hear you, and I want you to know that your feelings are valid. Sometimes just talking about things can help lighten the load. What's been the most challenging part of your day?",
      "That sounds really difficult. You're showing great strength by reaching out. What's one small thing that might help you feel a bit better today?",
      "I appreciate you opening up to me. It takes courage to be vulnerable. How can I best support you right now?"
    ]
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const addMoodEntry = async () => {
    if (!currentMood) return

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      intensity: moodIntensity,
      notes: moodNotes,
      timestamp: new Date()
    }

    setMoodEntries(prev => [...prev, newEntry])
    
    try {
      // Get AI tips based on mood
      const response = await fetch('/api/mood-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mood: currentMood, 
          intensity: moodIntensity, 
          notes: moodNotes 
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const tips = data.tips.join('\n\n')
        
        // Add tips as a message
        const tipsMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: tips,
          isUser: false,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, tipsMessage])
      }
    } catch (error) {
      console.error('Error getting mood tips:', error)
    }
    
    // Reset form
    setCurrentMood('')
    setMoodNotes('')
    setMoodIntensity(5)
  }



  const getMoodChartData = () => {
    const last7Days = moodEntries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 7)
      .reverse()

    const moodValues = last7Days.map(entry => {
      const moodScores = { 'Happy': 8, 'Excited': 9, 'Calm': 7, 'Neutral': 5, 'Tired': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 1 }
      return moodScores[entry.mood as keyof typeof moodScores] || 5
    })

    return {
      labels: last7Days.map(entry => entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Mood Trend',
          data: moodValues,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  MindMate
                </h1>
                <p className="text-sm text-gray-600">Your AI Mental Wellness Companion</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Hack Node India 2025
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('mood')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'mood'
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Mood Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Chat with MindMate</h2>
              <p className="text-gray-600">Share your thoughts, feelings, or concerns. I'm here to listen and support you.</p>
            </div>
            
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Start a conversation with MindMate</p>
                  <p className="text-sm">Share what's on your mind...</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200/50">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Share what's on your mind..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mood Tracker Tab */}
        {activeTab === 'mood' && (
          <div className="space-y-6">
            {/* Mood Input Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling today?</h2>
              
              {/* Mood Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select your mood:</label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(moodIcons).map(([mood, Icon]) => (
                    <button
                      key={mood}
                      onClick={() => setCurrentMood(mood)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentMood === mood
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        currentMood === mood ? 'text-indigo-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        currentMood === mood ? 'text-indigo-600' : 'text-gray-700'
                      }`}>
                        {mood}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Intensity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Intensity: {moodIntensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodIntensity}
                  onChange={(e) => setMoodIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional notes (optional):
                </label>
                <textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="What's contributing to this mood?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={addMoodEntry}
                disabled={!currentMood}
                className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Log My Mood
              </button>
            </div>

            {/* Recent Mood Entries */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Mood Entries</h3>
              {moodEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No mood entries yet. Start tracking your emotional journey!</p>
              ) : (
                <div className="space-y-3">
                  {moodEntries
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 5)
                    .map((entry) => {
                      const Icon = moodIcons[entry.mood as keyof typeof moodIcons]
                      return (
                        <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className="h-6 w-6 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-800">{entry.mood}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">Intensity: {entry.intensity}/10</span>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {entry.timestamp.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-800">{moodEntries.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chat Messages</p>
                    <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Tracked</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Set(moodEntries.map(entry => 
                        entry.timestamp.toDateString()
                      )).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Trends (Last 7 Days)</h3>
              {moodEntries.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Start tracking your moods to see trends</p>
                </div>
              ) : (
                <div className="h-64">
                  <Line data={getMoodChartData()} options={chartOptions} />
                </div>
              )}
            </div>

            {/* Mood Distribution */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Distribution</h3>
              {moodEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data to display yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(moodIcons).map(([mood, Icon]) => {
                    const count = moodEntries.filter(entry => entry.mood === mood).length
                    const percentage = moodEntries.length > 0 ? (count / moodEntries.length) * 100 : 0
                    
                    if (count === 0) return null
                    
                    return (
                      <div key={mood} className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="flex-1 text-sm text-gray-700">{mood}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              MindMate - AI-Powered Mental Wellness Companion
            </p>
            <p className="text-xs mt-1">
              Built for Hack Node India 2025 • OpenXAI • Privacy-First Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 