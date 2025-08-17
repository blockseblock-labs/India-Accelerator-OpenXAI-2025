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
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              💬 Social Network AI
            </h1>
          </div>
          <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Transform your social media presence with AI-powered tools for captions, mood analysis, and hashtag optimization
          </p>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex space-x-1 shadow-2xl border border-white/20">
            {[
              { id: 'caption', label: '📸 Caption', desc: 'Generate Captions', gradient: 'instagram-gradient' },
              { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment', gradient: 'twitter-gradient' },
              { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags', gradient: 'social-gradient' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button px-8 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${tab.gradient} text-white shadow-lg transform scale-105`
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="text-base font-semibold">{tab.label}</div>
                <div className="text-sm opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="max-w-5xl mx-auto">
          {/* Caption Generator Tab */}
          {activeTab === 'caption' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">📸 Caption Generator</h2>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    Describe your image and get an Instagram-ready caption that will boost your engagement!
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder="Describe your image... (e.g., 'Sunset at the beach with friends, golden hour lighting, peaceful vibes')"
                      className="enhanced-input w-full h-36 p-6 rounded-xl border-0 text-white placeholder-white/60 focus:ring-0 resize-none text-lg leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {imageDescription.length}/500
                    </div>
                  </div>
                  
                  <button
                    onClick={generateCaption}
                    disabled={loading || !imageDescription.trim()}
                    className="enhanced-button w-full px-8 py-4 instagram-gradient text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Generating Caption<span className="loading-dots"></span>
                      </span>
                    ) : (
                      'Generate Caption ✨'
                    )}
                  </button>

                  {generatedCaption && (
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-xl">Your Caption:</h3>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-white/95 text-lg leading-relaxed bg-white/10 p-4 rounded-lg">
                        {generatedCaption}
                      </p>
                      <button
                        onClick={() => copyToClipboard(generatedCaption, 'caption')}
                        className={`copy-button px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          captionCopied 
                            ? 'copied text-white' 
                            : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
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
              <div className="social-card rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">😊 Mood Checker</h2>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    Analyze the emotional sentiment of any text with our advanced AI mood detection!
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={textToAnalyze}
                      onChange={(e) => setTextToAnalyze(e.target.value)}
                      placeholder="Paste a tweet, comment, or any text here to analyze its emotional tone..."
                      className="enhanced-input w-full h-36 p-6 rounded-xl border-0 text-white placeholder-white/60 focus:ring-0 resize-none text-lg leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {textToAnalyze.length}/1000
                    </div>
                  </div>
                  
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="enhanced-button w-full px-8 py-4 twitter-gradient text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Analyzing Mood<span className="loading-dots"></span>
                      </span>
                    ) : (
                      'Check Mood 🔍'
                    )}
                  </button>

                  {moodResult && (
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-center space-y-6 border border-white/20">
                      <div className="mood-indicator text-7xl">{moodResult.emoji}</div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold text-white capitalize bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                          {moodResult.mood}
                        </h3>
                        <p className="text-white/80 text-lg">
                          Detected sentiment with <span className="font-semibold text-yellow-300">{moodResult.confidence}</span> confidence
                        </p>
                      </div>
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hashtag Suggestor Tab */}
          {activeTab === 'hashtags' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">#️⃣ Hashtag Suggestor</h2>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    Get trending and relevant hashtags to maximize your post reach and engagement!
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Enter keywords about your content... (e.g., 'travel photography nature adventure')"
                      className="enhanced-input w-full p-6 rounded-xl border-0 text-white placeholder-white/60 focus:ring-0 text-lg"
                      onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40">
                      💡
                    </div>
                  </div>
                  
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="enhanced-button w-full px-8 py-4 social-gradient text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Finding Hashtags<span className="loading-dots"></span>
                      </span>
                    ) : (
                      'Suggest Hashtags 🏷️'
                    )}
                  </button>

                  {hashtags.length > 0 && (
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 space-y-6 border border-white/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-xl">Suggested Hashtags:</h3>
                        <div className="text-white/60 text-sm">{hashtags.length} tags found</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {hashtags.map((hashtag, index) => (
                          <span 
                            key={index} 
                            className="hashtag-tag cursor-pointer"
                            onClick={() => copyToClipboard(hashtag, 'hashtags')}
                            title="Click to copy"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                        className={`copy-button px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          hashtagsCopied 
                            ? 'copied text-white' 
                            : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
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

        {/* Enhanced Footer */}
        <div className="text-center mt-16 text-white/70">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
            <p className="text-lg font-medium mb-2">Perfect for Instagram, Twitter, TikTok, and all your social platforms! 🚀</p>
            <p className="text-sm opacity-75">Powered by AI to enhance your social media presence</p>
          </div>
        </div>
      </div>
    </div>
  )
} 