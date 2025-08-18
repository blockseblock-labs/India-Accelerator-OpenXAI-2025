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
  
  const [imageDescription, setImageDescription] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)
  
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)
  
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
      if (data.caption) setGeneratedCaption(data.caption)
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
      if (data.mood) setMoodResult(data)
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
      if (data.hashtags) setHashtags(data.hashtags)
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
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 mb-4 animate-pulse">
            💬 Social Network AI
          </h1>
          <p className="text-white/80 text-lg">AI-Powered Social Media Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 flex space-x-3">
            {[
              { id: 'caption', label: '📸 Caption', desc: 'Generate Captions', gradient: 'instagram-gradient' },
              { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment', gradient: 'twitter-gradient' },
              { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags', gradient: 'social-gradient' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? `${tab.gradient} text-white shadow-2xl transform scale-105`
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="text-sm">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Caption Generator */}
          {activeTab === 'caption' && (
            <div className="social-card rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-white mb-4">📸 Caption Generator</h2>
              <p className="text-white/80 mb-4">Describe your image to get a ready-to-post caption!</p>
              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Describe your image..."
                className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
              />
              <button
                onClick={generateCaption}
                disabled={loading || !imageDescription.trim()}
                className="w-full mt-4 px-6 py-3 instagram-gradient text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Generating Caption...' : 'Generate Caption ✨'}
              </button>
              {generatedCaption && (
                <div className="bg-white/20 rounded-lg p-4 mt-4 space-y-2">
                  <h3 className="font-semibold text-white">Your Caption:</h3>
                  <p className="text-white/90 text-lg leading-relaxed">{generatedCaption}</p>
                  <button
                    onClick={() => copyToClipboard(generatedCaption, 'caption')}
                    className={`px-4 py-2 rounded-lg font-medium ${captionCopied ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                  >
                    {captionCopied ? 'Copied! ✓' : 'Copy Caption 📋'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mood Checker */}
          {activeTab === 'mood' && (
            <div className="social-card rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-white mb-4">😊 Mood Checker</h2>
              <p className="text-white/80 mb-4">Paste any text to analyze its sentiment!</p>
              <textarea
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
              />
              <button
                onClick={checkMood}
                disabled={loading || !textToAnalyze.trim()}
                className="w-full mt-4 px-6 py-3 twitter-gradient text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Analyzing Mood...' : 'Check Mood 🔍'}
              </button>
              {moodResult && (
                <div className="bg-white/20 rounded-lg p-6 mt-4 text-center space-y-2">
                  <div className="text-6xl">{moodResult.emoji}</div>
                  <h3 className="text-2xl font-bold text-white capitalize">{moodResult.mood}</h3>
                  <p className="text-white/80">Detected with {moodResult.confidence} confidence</p>
                </div>
              )}
            </div>
          )}

          {/* Hashtag Suggestor */}
          {activeTab === 'hashtags' && (
            <div className="social-card rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-white mb-4">#️⃣ Hashtag Suggestor</h2>
              <p className="text-white/80 mb-4">Enter keywords to get trending hashtags!</p>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords..."
                onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={suggestHashtags}
                disabled={loading || !keywords.trim()}
                className="w-full mt-4 px-6 py-3 social-gradient text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Finding Hashtags...' : 'Suggest Hashtags 🏷️'}
              </button>
              {hashtags.length > 0 && (
                <div className="bg-white/20 rounded-lg p-4 mt-4 space-y-2">
                  <h3 className="font-semibold text-white">Suggested Hashtags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, i) => <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-white">{tag}</span>)}
                  </div>
                  <button
                    onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                    className={`px-4 py-2 rounded-lg font-medium ${hashtagsCopied ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                  >
                    {hashtagsCopied ? 'Copied! ✓' : 'Copy All Hashtags 📋'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/70">
          <p>Perfect for Instagram, Twitter, TikTok, and all social platforms 🚀</p>
          <p className="mt-2 text-sm">Updated UI by YourName</p>
        </div>
      </div>
    </div>
  )
}
