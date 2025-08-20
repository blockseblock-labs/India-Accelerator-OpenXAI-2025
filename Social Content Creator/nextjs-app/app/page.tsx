'use client'

import { useState } from 'react'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

interface Track {
  title: string
  genre: string
  bpm: number
  vibe: string
  keywords: string
  drop: number
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

  // Translator states
  const [translateText, setTranslateText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [targetLang, setTargetLang] = useState('Hindi')

  // Music Suggester states
  const [musicCaption, setMusicCaption] = useState('')
  const [musicMood, setMusicMood] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])

  // --- API Calls ---
  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription }),
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
        body: JSON.stringify({ text: textToAnalyze }),
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
        body: JSON.stringify({ keywords }),
      })
      const data = await response.json()
      if (data.hashtags) setHashtags(data.hashtags)
    } catch (error) {
      console.error('Error suggesting hashtags:', error)
    }
    setLoading(false)
  }

  const translate = async () => {
    if (!translateText.trim() || !targetLang) return
    setLoading(true)
    try {
      const response = await fetch('/api/translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: translateText, targetLang }),
      })
      const data = await response.json()
      if (data.translated) setTranslatedText(data.translated)
    } catch (error) {
      console.error('Error translating text:', error)
    }
    setLoading(false)
  }

  const suggestMusic = async () => {
    if (!musicCaption.trim() && !musicMood.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/music-suggester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: musicCaption, mood: musicMood }),
      })
      const data = await response.json()
      if (data.tracks) setTracks(data.tracks)
    } catch (error) {
      console.error('Error suggesting music:', error)
    }
    setLoading(false)
  }

  const copyToClipboard = async (text: string, type: 'caption' | 'hashtags' | 'translated') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'caption') {
        setCaptionCopied(true)
        setTimeout(() => setCaptionCopied(false), 2000)
      } else if (type === 'hashtags') {
        setHashtagsCopied(true)
        setTimeout(() => setHashtagsCopied(false), 2000)
      } else {
        alert('Copied to clipboard!')
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // --- Tabs Configuration with Colors ---
  const tabs = [
  { id: 'caption', label: '📸 Caption', desc: 'Generate Captions', gradient: 'from-rose-700 via-rose-800 to-rose-900 border-rose-600' },
  { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment', gradient: 'from-sky-700 via-blue-800 to-blue-900 border-sky-600' },
  { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags', gradient: 'from-emerald-700 via-green-800 to-green-900 border-emerald-600' },
  { id: 'translate', label: '🌐 Translate', desc: 'Multilingual', gradient: 'from-violet-700 via-purple-800 to-purple-900 border-violet-600' },
  { id: 'music', label: '🎵 Music', desc: 'AI Background Music', gradient: 'from-amber-700 via-orange-800 to-orange-900 border-amber-600' },
]

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💬 Social Network AI</h1>
          <p className="text-white/80 text-lg">AI-Powered Social Media Tools</p>
          <p className="text-white/70 text-base max-w-2xl mx-auto mt-2">
          Explore a variety of smart features — generate creative captions, check the mood of your posts, 
          discover trending hashtags, translate your text into multiple languages, and even get music suggestions 
          that match your vibe. </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 flex-wrap">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2 flex-wrap justify-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg border-2 transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                    : 'text-white hover:bg-white/10 border-transparent'
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
          {/* Caption Tab */}
          {activeTab === 'caption' && (
            <div className="tab-content">
              <div className={`rounded-xl p-6 bg-gradient-to-r ${tabs.find(t => t.id === 'caption')?.gradient}`}>
                <h2 className="text-2xl font-bold text-white mb-4">📸 Caption Generator</h2>
                <p className="text-white/80 mb-6">Generate Instagram-ready captions from your image description!</p>

                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Describe your image..."
                  className="w-full h-24 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none mb-4"
                />

                <button
                  onClick={generateCaption}
                  disabled={loading || !imageDescription.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mb-4"
                >
                  {loading ? 'Generating...' : 'Generate Caption ✨'}
                </button>

                {generatedCaption && (
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-white/90">{generatedCaption}</p>
                    <button
                      onClick={() => copyToClipboard(generatedCaption, 'caption')}
                      className="px-4 py-2 mt-2 rounded-lg font-medium bg-white/20 hover:bg-white/30 text-white"
                    >
                      Copy Caption 📋
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mood Tab */}
          {activeTab === 'mood' && (
            <div className="tab-content">
              <div className={`rounded-xl p-6 bg-gradient-to-r ${tabs.find(t => t.id === 'mood')?.gradient}`}>
                <h2 className="text-2xl font-bold text-white mb-4">😊 Mood Checker</h2>
                <p className="text-white/80 mb-6">Analyze the mood of your text!</p>

                <textarea
                  value={textToAnalyze}
                  onChange={(e) => setTextToAnalyze(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full h-24 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none mb-4"
                />

                <button
                  onClick={checkMood}
                  disabled={loading || !textToAnalyze.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mb-4"
                >
                  {loading ? 'Analyzing...' : 'Check Mood 😊'}
                </button>

                {moodResult && (
                  <div className="bg-white/20 rounded-lg p-4 flex items-center space-x-4">
                    <span className="text-2xl">{moodResult.emoji}</span>
                    <div>
                      <p className="text-white/90 font-medium">Mood: {moodResult.mood}</p>
                      <p className="text-white/80 text-sm">Confidence: {moodResult.confidence}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hashtags Tab */}
          {activeTab === 'hashtags' && (
            <div className="tab-content">
              <div className={`rounded-xl p-6 bg-gradient-to-r ${tabs.find(t => t.id === 'hashtags')?.gradient}`}>
                <h2 className="text-2xl font-bold text-white mb-4">#️⃣ Hashtag Suggestor</h2>
                <p className="text-white/80 mb-6">Generate trending hashtags from keywords!</p>

                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords..."
                  className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 mb-4"
                />

                <button
                  onClick={suggestHashtags}
                  disabled={loading || !keywords.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mb-4"
                >
                  {loading ? 'Suggesting...' : 'Suggest Hashtags ✨'}
                </button>

                {hashtags.length > 0 && (
                  <div className="bg-white/20 rounded-lg p-4 flex flex-wrap gap-2">
                    {hashtags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                        {tag}
                      </span>
                    ))}
                    <button
                      onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                      className="px-4 py-2 mt-2 rounded-lg font-medium bg-white/20 hover:bg-white/30 text-white"
                    >
                      Copy All Hashtags 📋
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Translator Tab */}
          {activeTab === 'translate' && (
            <div className="tab-content">
              <div className={`rounded-xl p-6 bg-gradient-to-r ${tabs.find(t => t.id === 'translate')?.gradient}`}>
                <h2 className="text-2xl font-bold text-white mb-4">🌐 Multilingual Translator</h2>
                <p className="text-white/80 mb-6">Translate your captions or any text to another language!</p>

                <textarea
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none mb-4"
                />

                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full p-4 rounded-lg border-0 bg-white/20 text-white mb-4 focus:ring-2 focus:ring-white/30"
                >
                  {[
                  'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam',
                  'Spanish', 'French', 'German', 'Italian', 'Portuguese',
                  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic',
                  'Turkish', 'Dutch', 'Greek', 'Polish', 'Hebrew',
                  ].map(lang => (
                  <option key={lang} value={lang} className="bg-gray-800 text-white">
                  {lang}
                  </option>
                  ))}

                </select>

                <button
                  onClick={translate}
                  disabled={loading || !translateText.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mb-4"
                >
                  {loading ? 'Translating...' : 'Translate ✨'}
                </button>

                {translatedText && (
                  <div className="bg-white/20 rounded-lg p-4">
                    <h3 className="font-semibold text-white">Translated Text:</h3>
                    <p className="text-white/90 text-lg leading-relaxed">{translatedText}</p>
                    <button
                      onClick={() => copyToClipboard(translatedText, 'translated')}
                      className="px-4 py-2 mt-2 rounded-lg font-medium bg-white/20 hover:bg-white/30 text-white"
                    >
                      Copy Translated Text 📋
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Music Tab */}
          {activeTab === 'music' && (
            <div className="tab-content">
              <div className={`rounded-xl p-6 bg-gradient-to-r ${tabs.find(t => t.id === 'music')?.gradient}`}>
                <h2 className="text-2xl font-bold text-white mb-4">🎵 AI Music Suggester</h2>
                <p className="text-white/80 mb-6">Generate background music ideas based on your caption or mood!</p>

                <textarea
                  value={musicCaption}
                  onChange={(e) => setMusicCaption(e.target.value)}
                  placeholder="Enter your caption..."
                  className="w-full h-24 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none mb-4"
                />

                <input
                  type="text"
                  value={musicMood}
                  onChange={(e) => setMusicMood(e.target.value)}
                  placeholder="Optional mood..."
                  className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 mb-4"
                />

                <button
                  onClick={suggestMusic}
                  disabled={loading || (!musicCaption.trim() && !musicMood.trim())}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mb-4"
                >
                  {loading ? 'Suggesting Music...' : 'Suggest Music 🎶'}
                </button>

                {tracks.length > 0 && (
                  <div className="bg-white/20 rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-white mb-2">Recommended Tracks:</h3>
                    {tracks.map((track, idx) => (
                      <div key={idx} className="border-b border-white/20 pb-2 mb-2">
                        <p className="text-white font-medium">{track.title} ({track.genre}, {track.bpm} BPM)</p>
                        <p className="text-white/80 text-sm">Vibe: {track.vibe}</p>
                        <p className="text-white/80 text-sm">Keywords: {track.keywords}</p>
                      </div>
                    ))}
                  </div>
                )}
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
