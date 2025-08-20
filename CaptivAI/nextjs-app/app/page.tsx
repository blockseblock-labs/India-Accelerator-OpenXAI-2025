'use client'

import { useState } from 'react'

interface emotionResult {
  emotion: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState('Smart Caption AI ✍️')
  const [loading, setLoading] = useState(false)
  
  // Smart Caption AI ✍️ Generator states
  const [imageDescription, setImageDescription] = useState('')
  const [generatedSmart Caption AI ✍️, setGeneratedSmart Caption AI ✍️] = useState('')
  const [Smart Caption AI ✍️Copied, setSmart Caption AI ✍️Copied] = useState(false)
  
  // emotion Checker states
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [emotionResult, setemotionResult] = useState<emotionResult | null>(null)
  
  // Hashtag Suggestor states
  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  const generateSmart Caption AI ✍️ = async () => {
    if (!imageDescription.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/Smart Caption AI ✍️-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription })
      })
      
      const data = await response.json()
      if (data.Smart Caption AI ✍️) {
        setGeneratedSmart Caption AI ✍️(data.Smart Caption AI ✍️)
      }
    } catch (error) {
      console.error('Error generating Smart Caption AI ✍️:', error)
    }
    setLoading(false)
  }

  const checkemotion = async () => {
    if (!textToAnalyze.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/emotion-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      })
      
      const data = await response.json()
      if (data.emotion) {
        setemotionResult(data)
      }
    } catch (error) {
      console.error('Error checking emotion:', error)
    }
    setLoading(false)
  }

  const suggestHashtags = async () => {
    if (!keywords.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/hashtag-suggestor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      })
      
      const data = await response.json()
      if (data.hashtags) {
        setHashtags(data.hashtags)
      }
    } catch (error) {
      console.error('Error suggesting hashtags:', error)
    }
    setLoading(false)
  }

  const copyToClipboard = async (text: string, type: 'Smart Caption AI ✍️' | 'hashtags') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'Smart Caption AI ✍️') {
        setSmart Caption AI ✍️Copied(true)
        setTimeout(() => setSmart Caption AI ✍️Copied(false), 2000)
      } else {
        setHashtagsCopied(true)
        setTimeout(() => setHashtagsCopied(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💬 InsightStream AI</h1>
          <p className="text-white/80 text-lg">Turning text streams into insights, Smart Caption AI ✍️s, and viral ideas 💡</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {[
              { id: 'Smart Caption AI ✍️', label: '📸 Smart Caption AI ✍️', desc: 'Generate Smart Caption AI ✍️s', gradient: 'instagram-gradient' },
              { id: 'emotion', label: '😊 emotion', desc: 'Check Sentiment', gradient: 'twitter-gradient' },
              { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags', gradient: 'social-gradient' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? `${tab.gradient} text-white shadow-lg`
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Smart Caption AI ✍️ Generator Tab */}
          {activeTab === 'Smart Caption AI ✍️' && (
            <div className="tab-content">
              <div className="social-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">📸 Smart Caption AI ✍️ Generator</h2>
                <p className="text-white/80 mb-6">Describe your image and get an Instagram-ready Smart Caption AI ✍️!</p>
                
                <div className="space-y-4">
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Describe your image... (e.g., 'Sunset at the beach with friends')"
                    className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  
                  <button
                    onClick={generateSmart Caption AI ✍️}
                    disabled={loading || !imageDescription.trim()}
                    className="w-full px-6 py-3 instagram-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Generating Smart Caption AI ✍️...' : 'Generate Smart Caption AI ✍️ ✨'}
                  </button>

                  {generatedSmart Caption AI ✍️ && (
                    <div className="bg-white/20 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-white">Your Smart Caption AI ✍️:</h3>
                      <p className="text-white/90 text-lg leading-relaxed">{generatedSmart Caption AI ✍️}</p>
                      <button
                        onClick={() => copyToClipboard(generatedSmart Caption AI ✍️, 'Smart Caption AI ✍️')}
                        className={`copy-button px-4 py-2 rounded-lg font-medium ${
                          Smart Caption AI ✍️Copied ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        {Smart Caption AI ✍️Copied ? 'Copied! ✓' : 'Copy Smart Caption AI ✍️ 📋'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* emotion Checker Tab */}
          {activeTab === 'emotion' && (
            <div className="tab-content">
              <div className="social-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">😊 emotion Checker</h2>
                <p className="text-white/80 mb-6">Paste any text to analyze its emotional sentiment!</p>
                
                <div className="space-y-4">
                  <textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Paste a tweet, comment, or any text here..."
                    className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  
                  <button
                    onClick={checkemotion}
                    disabled={loading || !textToAnalyze.trim()}
                    className="w-full px-6 py-3 twitter-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Analyzing emotion...' : 'Check emotion 🔍'}
                  </button>

                  {emotionResult && (
                    <div className="bg-white/20 rounded-lg p-6 text-center space-y-4">
                      <div className="emotion-indicator text-6xl">{emotionResult.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white capitalize">{emotionResult.emotion}</h3>
                        <p className="text-white/80">Detected sentiment with {emotionResult.confidence} confidence</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hashtag Suggestor Tab */}
          {activeTab === 'hashtags' && (
            <div className="tab-content">
              <div className="social-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">#️⃣ Hashtag Suggestor</h2>
                <p className="text-white/80 mb-6">Enter keywords and get trending hashtags for your post!</p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords... (e.g., 'travel photography nature')"
                    className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                  />
                  
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="w-full px-6 py-3 social-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Finding Hashtags...' : 'Suggest Hashtags 🏷️'}
                  </button>

                  {hashtags.length > 0 && (
                    <div className="bg-white/20 rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold text-white">Suggested Hashtags:</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((hashtag, index) => (
                          <span key={index} className="hashtag-tag">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                        className={`copy-button px-4 py-2 rounded-lg font-medium ${
                          hashtagsCopied ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        {hashtagsCopied ? 'Copied! ✓' : 'Copy All Hashtags 📋'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p>Perfect for Instagram, Twitter, TikTok, and all your social platforms! 🚀</p>
        </div>
      </div>
    </div>
  )
} 