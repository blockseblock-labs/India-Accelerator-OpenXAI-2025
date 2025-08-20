'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"

const tabs = [
  { id: 'caption', label: 'Caption Generator', desc: 'Generate captions for your images' },
  { id: 'mood', label: 'Mood Checker', desc: 'Analyze text sentiment' },
  { id: 'hashtags', label: 'Hashtag Suggestor', desc: 'Get trending hashtags' },
]

const gradientThemes = {
  blue: 'from-blue-500 to-blue-700',
  pink: 'from-pink-500 to-pink-700',
  green: 'from-green-500 to-green-700',
  purple: 'from-purple-500 to-purple-700',
}

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState('caption')
  const [loading, setLoading] = useState(false)

  // Theme
  const [theme, setTheme] = useState<keyof typeof gradientThemes>('blue')

  // Caption Generator
  const [imageDescription, setImageDescription] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)

  // Mood Checker
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)

  // Hashtag Suggestor
  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  // ----- API calls -----
  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription })
      })
      const data = await res.json()
      if (data.caption) setGeneratedCaption(data.caption)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const checkMood = async () => {
    if (!textToAnalyze.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/mood-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      })
      const data = await res.json()
      if (data.mood) setMoodResult(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const suggestHashtags = async () => {
    if (!keywords.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/hashtag-suggestor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      })
      const data = await res.json()
      if (data.hashtags) setHashtags(data.hashtags)
    } catch (e) {
      console.error(e)
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
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientThemes[theme]} transition-all`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
            💬 Social Network AI
          </h1>
          <p className="text-white/80 text-lg">AI-Powered Social Media Tools</p>
        </div>

        {/* Theme Switcher */}
        <div className="flex justify-center mb-6 space-x-3">
          {(Object.keys(gradientThemes) as Array<keyof typeof gradientThemes>).map((key) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`px-4 py-2 rounded-xl font-medium text-white bg-white/20 hover:bg-white/30 transition-all ${
                theme === key && "ring-2 ring-white"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-black shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <div className="text-sm font-semibold">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Animated Content with inputs */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              {/* Caption Generator */}
              {activeTab === "caption" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">📸 Caption Generator</h2>
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Describe your image..."
                    className="w-full h-28 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  <button
                    onClick={generateCaption}
                    disabled={loading || !imageDescription.trim()}
                    className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Caption ✨'}
                  </button>
                  {generatedCaption && (
                    <div className="mt-4 bg-white/20 rounded-lg p-4">
                      <p className="text-white">{generatedCaption}</p>
                      <button
                        onClick={() => copyToClipboard(generatedCaption, 'caption')}
                        className="mt-2 px-4 py-2 bg-white/30 text-white rounded-lg"
                      >
                        {captionCopied ? 'Copied! ✓' : 'Copy 📋'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mood Checker */}
              {activeTab === "mood" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">😊 Mood Checker</h2>
                  <textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Paste text here..."
                    className="w-full h-28 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="w-full mt-4 px-6 py-3 bg-pink-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Check Mood 🔍'}
                  </button>
                  {moodResult && (
                    <div className="mt-4 text-center bg-white/20 p-6 rounded-lg">
                      <div className="text-5xl">{moodResult.emoji}</div>
                      <h3 className="text-xl text-white mt-2">{moodResult.mood}</h3>
                      <p className="text-white/70">Confidence: {moodResult.confidence}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hashtag Suggestor */}
              {activeTab === "hashtags" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">#️⃣ Hashtag Suggestor</h2>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords..."
                    className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                  />
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? 'Finding...' : 'Suggest Hashtags 🏷️'}
                  </button>
                  {hashtags.length > 0 && (
                    <div className="mt-4 bg-white/20 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag, i) => (
                          <span key={i} className="bg-white/30 text-white px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                        className="mt-3 px-4 py-2 bg-white/30 text-white rounded-lg"
                      >
                        {hashtagsCopied ? 'Copied! ✓' : 'Copy All 📋'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/70">
          <p>Perfect for Instagram, Twitter, TikTok & more 🚀</p>
        </div>
      </div>
    </div>
  )
}
