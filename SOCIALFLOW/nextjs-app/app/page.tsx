'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  const tabs = [
    { 
      id: 'caption', 
      label: 'Caption Generator', 
      icon: '📸', 
      desc: 'Create engaging captions',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'mood', 
      label: 'Mood Checker', 
      icon: '😊', 
      desc: 'Analyze sentiment',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'hashtags', 
      label: 'Hashtag Suggestor', 
      icon: '#️⃣', 
      desc: 'Find trending tags',
      color: 'from-purple-500 to-indigo-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            SOCIALFLOW
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            AI-powered social media tools to elevate your content creation and engagement
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-2xl">
            <div className="flex space-x-2">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-8 py-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{tab.icon}</span>
                    <div className="text-sm font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.desc}</div>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Caption Generator Tab */}
            {activeTab === 'caption' && (
              <motion.div
                key="caption"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg">
                      <span className="text-2xl">📸</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Caption Generator</h2>
                    <p className="text-slate-300 text-lg">Transform your image descriptions into engaging, Instagram-ready captions</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        placeholder="Describe your image... (e.g., 'Sunset at the beach with friends, golden hour vibes')"
                        className="w-full h-40 p-6 rounded-2xl border-0 bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500/50 focus:bg-slate-700/70 resize-none text-lg transition-all duration-300"
                      />
                      <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
                        {imageDescription.length}/500
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={generateCaption}
                      disabled={loading || !imageDescription.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300 ${
                        loading ? 'cursor-wait' : 'hover:from-pink-600 hover:to-rose-600'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Generating Caption...</span>
                        </div>
                      ) : (
                        'Generate Caption ✨'
                      )}
                    </motion.button>

                    {generatedCaption && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                      >
                        <h3 className="font-semibold text-white text-lg mb-4 flex items-center">
                          <span className="mr-2">✨</span>
                          Your Generated Caption
                        </h3>
                        <p className="text-white/90 text-lg leading-relaxed mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                          {generatedCaption}
                        </p>
                        <motion.button
                          onClick={() => copyToClipboard(generatedCaption, 'caption')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            captionCopied 
                              ? 'bg-green-500 text-white' 
                              : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                          }`}
                        >
                          {captionCopied ? 'Copied! ✓' : 'Copy Caption 📋'}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Mood Checker Tab */}
            {activeTab === 'mood' && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                      <span className="text-2xl">😊</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Mood Checker</h2>
                    <p className="text-slate-300 text-lg">Analyze the emotional sentiment of any text with AI-powered insights</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={textToAnalyze}
                        onChange={(e) => setTextToAnalyze(e.target.value)}
                        placeholder="Paste a tweet, comment, or any text here to analyze its mood..."
                        className="w-full h-40 p-6 rounded-2xl border-0 bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-700/70 resize-none text-lg transition-all duration-300"
                      />
                      <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
                        {textToAnalyze.length}/1000
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={checkMood}
                      disabled={loading || !textToAnalyze.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300 ${
                        loading ? 'cursor-wait' : 'hover:from-blue-600 hover:to-cyan-600'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Analyzing Mood...</span>
                        </div>
                      ) : (
                        'Check Mood 🔍'
                      )}
                    </motion.button>

                    {moodResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-2xl p-8 text-center border border-slate-600/50"
                      >
                        <motion.div 
                          className="text-8xl mb-6"
                          animate={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          {moodResult.emoji}
                        </motion.div>
                        <div>
                          <h3 className="text-3xl font-bold text-white capitalize mb-2">{moodResult.mood}</h3>
                          <p className="text-slate-300 text-lg">Detected sentiment with {moodResult.confidence} confidence</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Hashtag Suggestor Tab */}
            {activeTab === 'hashtags' && (
              <motion.div
                key="hashtags"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
                      <span className="text-2xl">#️⃣</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Hashtag Suggestor</h2>
                    <p className="text-slate-300 text-lg">Discover trending and relevant hashtags to boost your post's reach</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter keywords... (e.g., 'travel photography nature adventure')"
                        className="w-full p-6 rounded-2xl border-0 bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:bg-slate-700/70 text-lg transition-all duration-300"
                        onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                      />
                    </div>
                    
                    <motion.button
                      onClick={suggestHashtags}
                      disabled={loading || !keywords.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300 ${
                        loading ? 'cursor-wait' : 'hover:from-purple-600 hover:to-indigo-600'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Finding Hashtags...</span>
                        </div>
                      ) : (
                        'Suggest Hashtags 🏷️'
                      )}
                    </motion.button>

                    {hashtags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                      >
                        <h3 className="font-semibold text-white text-lg mb-6 flex items-center">
                          <span className="mr-2">🏷️</span>
                          Suggested Hashtags
                        </h3>
                        
                        <div className="flex flex-wrap gap-3 mb-6">
                          {hashtags.map((hashtag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                              {hashtag}
                            </motion.span>
                          ))}
                        </div>
                        
                        <motion.button
                          onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            hashtagsCopied 
                              ? 'bg-green-500 text-white' 
                              : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                          }`}
                        >
                          {hashtagsCopied ? 'Copied! ✓' : 'Copy All Hashtags 📋'}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-slate-400"
        >
          <p className="text-lg">Perfect for Instagram, Twitter, TikTok, and all your social platforms! 🚀</p>
          <p className="text-sm mt-2 opacity-75">Powered by AI • Built with Next.js • Styled with Tailwind CSS</p>
        </motion.div>
      </div>
    </div>
  )
} 