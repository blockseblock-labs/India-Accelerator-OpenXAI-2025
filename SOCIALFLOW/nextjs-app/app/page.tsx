'use client'

import { useState } from 'react'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
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

  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription })
      })
      
      const data = await response.json()
      if (data.caption) {
        setGeneratedCaption(data.caption)
      }
    } catch (error) {
      console.error('Error generating caption:', error)
    }
    setLoading(false)
  }

  const checkMood = async () => {
    if (!textToAnalyze.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/mood-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      })
      
      const data = await response.json()
      if (data.mood) {
        setMoodResult(data)
      }
    } catch (error) {
      console.error('Error checking mood:', error)
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

  const copyToClipboard = async (text: string, type: 'caption' | 'hashtags') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'caption') {
        setCaptionCopied(true)
        setTimeout(() => setCaptionCopied(false), 2000)
      } else {
        setHashtagsCopied(true)
        setTimeout(() => setHashtagsCopied(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💬 Social Network AI</h1>
          <p className="text-red/500 text-lg">AI-Powered Social Media Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {[
              { id: 'caption', label: '📸 Caption', desc: 'Generate Captions', gradient: 'instagram-gradient' },
              { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment', gradient: 'twitter-gradient' },
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
          {/* Caption Generator Tab */}
          {activeTab === 'caption' && (
            <div className="tab-content">
              <div className="social-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">📸 Caption Generator</h2>
                <p className="text-white/80 mb-6">Describe your image and get an Instagram-ready caption!</p>
                
                <div className="space-y-4">
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Describe your image... (e.g., 'Sunset at the beach with friends')"
                    className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  
                  <button
                    onClick={generateCaption}
                    disabled={loading || !imageDescription.trim()}
                    className="w-full px-6 py-3 instagram-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Generating Caption...' : 'Generate Caption ✨'}
                  </button>

                  {generatedCaption && (
                    <div className="bg-white/20 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-white">Your Caption:</h3>
                      <p className="text-white/90 text-lg leading-relaxed">{generatedCaption}</p>
                      <button
                        onClick={() => copyToClipboard(generatedCaption, 'caption')}
                        className={`copy-button px-4 py-2 rounded-lg font-medium ${
                          captionCopied ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        {captionCopied ? 'Copied! ✓' : 'Copy Caption 📋'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mood Checker Tab */}
          {activeTab === 'mood' && (
            <div className="tab-content">
              <div className="social-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">😊 Mood Checker</h2>
                <p className="text-white/80 mb-6">Paste any text to analyze its emotional sentiment!</p>
                
                <div className="space-y-4">
                  <textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Paste a tweet, comment, or any text here..."
                    className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="w-full px-6 py-3 twitter-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Analyzing Mood...' : 'Check Mood 🔍'}
                  </button>

                  {moodResult && (
                    <div className="bg-white/20 rounded-lg p-6 text-center space-y-4">
                      <div className="mood-indicator text-6xl">{moodResult.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white capitalize">{moodResult.mood}</h3>
                        <p className="text-white/80">Detected sentiment with {moodResult.confidence} confidence</p>
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