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
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [captionCount, setCaptionCount] = useState(3)
  const [captionCopied, setCaptionCopied] = useState(false)
  const [captionCopiedIndex, setCaptionCopiedIndex] = useState<number | null>(null)
  
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
        body: JSON.stringify({ imageDescription, count: captionCount })
      })
      
      const data = await response.json()
      if (Array.isArray(data.captions)) {
        setGeneratedCaptions(data.captions)
        setCaptionCopied(false)
        setCaptionCopiedIndex(null)
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

  const copyToClipboard = async (text: string, type: 'caption' | 'captions' | 'hashtags', index?: number) => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'caption') {
        if (typeof index === 'number') {
          setCaptionCopiedIndex(index)
          setTimeout(() => setCaptionCopiedIndex(null), 2000)
        } else {
          setCaptionCopied(true)
          setTimeout(() => setCaptionCopied(false), 2000)
        }
      } else if (type === 'captions') {
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
    <div className="relative min-h-screen from-slate-900 via-slate-900 to-slate-950 bg-[radial-gradient(1200px_400px_at_10%_-20%,rgba(255,255,255,0.08),transparent),radial-gradient(1200px_400px_at_90%_10%,rgba(236,72,153,0.12),transparent),radial-gradient(800px_300px_at_50%_110%,rgba(99,102,241,0.12),transparent)]">
      <div className="aurora-bg">
        <div className="aurora-blob orange w-[40vw] h-[40vw] -top-20 -left-10"></div>
        <div className="aurora-blob pink w-[45vw] h-[45vw] -top-10 right-0"></div>
        <div className="aurora-blob purple w-[50vw] h-[50vw] bottom-0 left-10"></div>
        <div className="aurora-blob cyan w-[35vw] h-[35vw] bottom-10 right-10"></div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-white/90 text-sm mb-4 ring-glow">
            <span>✨ New</span>
            <span className="opacity-70">AI tools for your socials</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text tracking-tight mb-4">
            Social Network AI
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Create captivating captions, understand mood, and discover trending hashtags.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="glass rounded-2xl p-2 flex items-center justify-between">
            {[
              { id: 'caption', label: 'Caption', icon: '📸' },
              { id: 'mood', label: 'Mood', icon: '😊' },
              { id: 'hashtags', label: 'Hashtags', icon: '#️⃣' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative w-1/3 px-4 py-3 rounded-xl text-sm md:text-base font-medium text-white/90 hover-raise ${
                  activeTab === tab.id ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-6 -bottom-px h-0.5 bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-300"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Caption Generator Tab */}
          {activeTab === 'caption' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">📸 Caption Generator</h2>
                    <p className="text-white/80 mt-1">Describe your image and get an Instagram-ready caption.</p>
                  </div>
                  <div className="hidden md:block text-white/70 text-sm shine px-3 py-1 rounded-lg border border-white/10">AI Powered</div>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Describe your image... (e.g., 'Sunset at the beach with friends')"
                    className="w-full h-32 p-4 rounded-xl border border-white/10 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-fuchsia-300/50 focus:outline-none resize-none"
                  />
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        {[2,3].map(n => (
                          <button
                            key={n}
                            onClick={() => setCaptionCount(n)}
                            className={`px-3 py-2 rounded-lg border text-sm ${captionCount === n ? 'bg-white/20 border-white/30 text-white' : 'bg-white/10 border-white/10 text-white/80 hover:bg-white/15'}`}
                          >
                            {n} captions
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-white/70 text-xs mt-1">
                        <span>Choose how many</span>
                        <span>{captionCount} total</span>
                      </div>
                    </div>
                    <button
                      onClick={generateCaption}
                      disabled={loading || !imageDescription.trim()}
                      className="w-full px-6 py-3 instagram-gradient text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all hover-raise"
                    >
                      {loading ? 'Generating…' : 'Generate Captions ✨'}
                    </button>
                  </div>

                  {generatedCaptions.length > 0 && (
                    <div className="bg-white/10 rounded-xl p-4 space-y-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Generated Captions</h3>
                        <button
                          onClick={() => copyToClipboard(generatedCaptions.join('\n'), 'captions')}
                          className={`copy-button px-4 py-2 rounded-lg font-medium ${
                            captionCopied ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                        >
                          {captionCopied ? 'Copied All! ✓' : 'Copy All 📋'}
                        </button>
                      </div>
                      <div className="space-y-3">
                        {generatedCaptions.map((cap, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-white/60 text-sm mt-1">{idx + 1}.</div>
                            <div className="flex-1 text-white/90 leading-relaxed">{cap}</div>
                            <button
                              onClick={() => copyToClipboard(cap, 'caption', idx)}
                              className={`copy-button px-3 py-1.5 rounded-md text-sm font-medium ${
                                captionCopiedIndex === idx ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                              }`}
                            >
                              {captionCopiedIndex === idx ? 'Copied ✓' : 'Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mood Checker Tab */}
          {activeTab === 'mood' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">😊 Mood Checker</h2>
                    <p className="text-white/80 mt-1">Paste any text to analyze its emotional sentiment.</p>
                  </div>
                  <div className="hidden md:block text-white/70 text-sm shine px-3 py-1 rounded-lg border border-white/10">Real-time</div>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Paste a tweet, comment, or any text here..."
                    className="w-full h-32 p-4 rounded-xl border border-white/10 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-300/50 focus:outline-none resize-none"
                  />
                  
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="w-full px-6 py-3 twitter-gradient text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all hover-raise"
                  >
                    {loading ? 'Analyzing Mood...' : 'Check Mood 🔍'}
                  </button>

                  {moodResult && (
                    <div className="bg-white/10 rounded-xl p-6 text-center space-y-4 border border-white/10">
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
              <div className="social-card rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">#️⃣ Hashtag Suggestor</h2>
                    <p className="text-white/80 mt-1">Enter keywords and get trending hashtags for your post.</p>
                  </div>
                  <div className="hidden md:block text-white/70 text-sm shine px-3 py-1 rounded-lg border border-white/10">Trendy</div>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords... (e.g., 'travel photography nature')"
                    className="w-full p-4 rounded-xl border border-white/10 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-300/50 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                  />
                  
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="w-full px-6 py-3 social-gradient text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all hover-raise"
                  >
                    {loading ? 'Finding Hashtags...' : 'Suggest Hashtags 🏷️'}
                  </button>

                  {hashtags.length > 0 && (
                    <div className="bg-white/10 rounded-xl p-4 space-y-4 border border-white/10">
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