'use client'

import { useState } from 'react'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('caption')
  const [loading, setLoading] = useState(false)
  
  // Caption Generator states
  const [imageDescription, setImageDescription] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)
  
  // Mood Checker states
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)
  
  // Hashtag Suggestor states
  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  // Search functionality
  const [searchValue, setSearchValue] = useState('')

  // Handle search focus when menu item is clicked
  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId)
    setSearchValue('')
  }

  // Get placeholder text based on active tab
  const getPlaceholder = () => {
    switch(activeTab) {
      case 'caption':
        return 'Describe your image... (e.g., "Sunset at the beach with friends")'
      case 'mood':
        return 'Enter text to analyze sentiment...'
      case 'hashtags':
        return 'Enter keywords for hashtag suggestions...'
      default:
        return 'Select a tool from the menu...'
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar with updated layout */}
      <div className="w-72 bg-white/5 backdrop-blur-2xl py-6 flex flex-col border-r border-white/10">
        {/* Brand section */}
        <div className="px-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl instagram-gradient flex items-center justify-center text-2xl">
              ✨
            </div>
            <h1 className="text-2xl font-bold text-white">SocialFlow</h1>
          </div>
          <p className="text-sm text-white/70">AI-powered social tools</p>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6 flex-1 space-y-2">
          {[
            { id: 'caption', icon: '📸', label: 'Caption Generator', desc: 'Create engaging captions', gradient: 'instagram-gradient' },
            { id: 'mood', icon: '😊', label: 'Mood Analysis', desc: 'Check text sentiment', gradient: 'twitter-gradient' },
            { id: 'hashtags', icon: '#️⃣', label: 'Hashtag Tools', desc: 'Find trending tags', gradient: 'social-gradient' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleMenuClick(tab.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                activeTab === tab.id
                  ? `${tab.gradient} shadow-lg translate-x-2`
                  : 'hover:bg-white/10 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tab.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white">{tab.label}</div>
                  <div className="text-xs text-white/70">{tab.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="text-xs text-white/50 text-center">
            Powered by AI 🤖
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Search Area */}
          <div className={`transition-all duration-500 ${activeTab ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <div className="social-card">
              <div className="content-container">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {activeTab === 'caption' && '📸 Caption Generator'}
                  {activeTab === 'mood' && '😊 Mood Checker'}
                  {activeTab === 'hashtags' && '#️⃣ Hashtag Suggestor'}
                </h2>
                
                <textarea
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="mb-6 rounded-xl shadow-inner"
                />
                
                <button
                  onClick={() => {/* Handle search */}}
                  disabled={!searchValue.trim() || loading}
                  className={`w-2/3 px-6 py-3 ${activeTab}-gradient text-white rounded-xl font-medium
                          disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all`}
                >
                  {loading ? 'Processing...' : 'Generate ✨'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          {/* Add your results display logic here */}
        </div>
      </div>
    </div>
  )
}
