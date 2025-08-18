'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState('caption')
  const [loading, setLoading] = useState(false)

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

  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription }),
      })
      const data = await res.json()
      if (data.caption) setGeneratedCaption(data.caption)
    } catch (err) {
      console.error(err)
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
        body: JSON.stringify({ text: textToAnalyze }),
      })
      const data = await res.json()
      if (data.mood) setMoodResult(data)
    } catch (err) {
      console.error(err)
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
        body: JSON.stringify({ keywords }),
      })
      const data = await res.json()
      if (data.hashtags) setHashtags(data.hashtags)
    } catch (err) {
      console.error(err)
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
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            SocialFlow AI
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Smarter captions, moods & hashtags 
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-6 border-b border-gray-300 dark:border-gray-700">
            {[
              { id: 'caption', label: '📸 Caption' },
              { id: 'mood', label: '😊 Mood' },
              { id: 'hashtags', label: '#️⃣ Hashtags' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Caption Generator */}
            {activeTab === 'caption' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">📸 Caption Generator</h2>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Describe your image..."
                  className="w-full h-28 p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-purple-400 outline-none"
                />
                <button
                  onClick={generateCaption}
                  disabled={loading || !imageDescription.trim()}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Caption ✨'}
                </button>

                {generatedCaption && (
                  <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                    <p className="mb-3">{generatedCaption}</p>
                    <button
                      onClick={() => copyToClipboard(generatedCaption, 'caption')}
                      className={`px-4 py-2 rounded-lg transition ${
                        captionCopied
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {captionCopied ? 'Copied! ✓' : 'Copy Caption'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mood Checker */}
            {activeTab === 'mood' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">😊 Mood Checker</h2>
                <textarea
                  value={textToAnalyze}
                  onChange={(e) => setTextToAnalyze(e.target.value)}
                  placeholder="Paste any text to analyze..."
                  className="w-full h-28 p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  onClick={checkMood}
                  disabled={loading || !textToAnalyze.trim()}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Check Mood 🔍'}
                </button>

                {moodResult && (
                  <div className="mt-6 text-center space-y-3">
                    <div className="text-6xl">{moodResult.emoji}</div>
                    <h3 className="text-xl font-bold capitalize">{moodResult.mood}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {moodResult.confidence} confidence
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hashtag Suggestor */}
            {activeTab === 'hashtags' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">#️⃣ Hashtag Suggestor</h2>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords..."
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                  onClick={suggestHashtags}
                  disabled={loading || !keywords.trim()}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Finding...' : 'Suggest Hashtags 🏷️'}
                </button>

                {hashtags.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                      className={`px-4 py-2 rounded-lg transition ${
                        hashtagsCopied
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {hashtagsCopied ? 'Copied! ✓' : 'Copy All'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>✨ Made for Instagram, Twitter, TikTok & more</p>
        </div>
      </div>
    </div>
  )
}
