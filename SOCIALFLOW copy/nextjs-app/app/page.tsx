'use client'

import { useState } from 'react'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function Home() {
  const [showTools, setShowTools] = useState(false)

  // Shared states
  const [activeTab, setActiveTab] = useState<'caption' | 'mood' | 'hashtags'>('caption')
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
      console.error('Copy failed', e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 bg-white shadow flex items-center justify-between">
        <span className="text-2xl font-bold text-purple-700 tracking-tight">SocialFlow</span>
        <nav className="space-x-6">
          <button className="text-gray-700 hover:text-purple-700 font-medium transition" onClick={() => setShowTools(false)}>Home</button>
          <button className="text-gray-700 hover:text-purple-700 font-medium transition" onClick={() => setShowTools(true)}>Tools</button>
        </nav>
      </header>

      {!showTools ? (
        // Hero
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 mb-4 drop-shadow-lg">Welcome to SocialFlow</h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl">Your AI-powered social media assistant. Effortlessly generate captions, hashtags, and check your post's mood with a single click.</p>
          <button
            onClick={() => setShowTools(true)}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Get Started
          </button>
        </main>
      ) : (
        // Tools UI
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800 mb-2">💬 Social Network AI</h1>
            <p className="text-gray-600">AI-Powered Social Media Tools — captions, mood, hashtags</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
              { [
                { id: 'caption', label: '📸 Caption', desc: 'Generate Captions' },
                { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment' },
                { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-purple-700 text-white shadow-lg' : 'text-gray-700 hover:bg-white/10'}`}
                >
                  <div className="text-sm font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Caption Generator */}
            {activeTab === 'caption' && (
              <div className="rounded-xl p-6 bg-white/80 shadow">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">📸 Caption Generator</h2>
                <p className="text-gray-700 mb-4">Describe your image and get an Instagram-ready caption.</p>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Describe your image..."
                  className="w-full h-28 p-3 rounded-md border border-gray-200 mb-3 bg-white/90 text-gray-800 placeholder-gray-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={generateCaption}
                    disabled={loading || !imageDescription.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Caption'}
                  </button>
                  <button
                    onClick={() => { setImageDescription(''); setGeneratedCaption('') }}
                    className="px-4 py-2 border rounded-md text-gray-800"
                  >
                    Clear
                  </button>
                </div>

                {generatedCaption && (
                  <div className="mt-4 p-3 bg-white shadow rounded">
                    <h3 className="font-semibold text-gray-800">Your Caption</h3>
                    <p className="my-2 text-gray-800 break-words">{generatedCaption}</p>
                    <button onClick={() => copyToClipboard(generatedCaption, 'caption')} className="px-3 py-1 bg-gray-800 text-white rounded">{captionCopied ? 'Copied' : 'Copy'}</button>
                  </div>
                )}
              </div>
            )}

            {/* Mood Checker */}
            {activeTab === 'mood' && (
              <div className="rounded-xl p-6 bg-white/80 shadow">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">😊 Mood Checker</h2>
                <p className="text-gray-700 mb-4">Paste text to analyze its emotional sentiment.</p>
                <textarea
                  value={textToAnalyze}
                  onChange={(e) => setTextToAnalyze(e.target.value)}
                  placeholder="Paste text..."
                  className="w-full h-28 p-3 rounded-md border border-gray-200 mb-3 bg-white/90 text-gray-800 placeholder-gray-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Check Mood'}
                  </button>
                  <button onClick={() => { setTextToAnalyze(''); setMoodResult(null) }} className="px-4 py-2 border rounded-md text-gray-800">Clear</button>
                </div>

                {moodResult && (
                  <div className="mt-4 p-4 bg-white shadow rounded text-center">
                    <div className="text-5xl">{moodResult.emoji}</div>
                    <h3 className="text-xl font-semibold mt-2 capitalize">{moodResult.mood}</h3>
                    <p className="text-sm text-gray-600">Confidence: {moodResult.confidence}</p>
                  </div>
                )}
              </div>
            )}

            {/* Hashtag Suggestor */}
            {activeTab === 'hashtags' && (
              <div className="rounded-xl p-6 bg-white/80 shadow">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">#️⃣ Hashtag Suggestor</h2>
                <p className="text-gray-700 mb-4">Enter keywords to get suggested hashtags.</p>
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., travel photography nature"
                  className="w-full p-3 rounded-md border border-gray-200 mb-3 bg-white/90 text-gray-800 placeholder-gray-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Finding...' : 'Suggest Hashtags'}
                  </button>
                  <button onClick={() => { setKeywords(''); setHashtags([]) }} className="px-4 py-2 border rounded-md text-gray-800">Clear</button>
                </div>

                {hashtags.length > 0 && (
                  <div className="mt-4 p-3 bg-white shadow rounded">
                    <div className="flex flex-wrap gap-2">{hashtags.map((h, i) => <span key={i} className="px-2 py-1 bg-gray-100 rounded">{h}</span>)}</div>
                    <div className="mt-3">
                      <button onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')} className="px-3 py-1 bg-gray-800 text-white rounded">{hashtagsCopied ? 'Copied' : 'Copy All'}</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">Perfect for Instagram, Twitter, TikTok and more.</div>
        </main>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-500 text-sm bg-white/70 mt-auto">
        &copy; {new Date().getFullYear()} SocialFlow. All rights reserved.
      </footer>
    </div>
  )
}