'use client'

import { useState } from 'react'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState<'caption'|'mood'|'hashtags'>('caption')
  const [loading, setLoading] = useState(false)

  const [imageDescription, setImageDescription] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)

  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)

  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  const handleApi = async (url: string, payload: object, setter: any) => {
    setLoading(true)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setter(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans antialiased">
      <div className="max-w-lg mx-auto py-12 px-6 space-y-12">

        <header className="space-y-2">
          <h1 className="text-3xl font-medium">Social Network AI</h1>
          <p className="text-sm text-neutral-600">
            Minimal AI tools to enhance your social media voice
          </p>
        </header>

        {/* Tab Controls */}
        <div className="flex justify-evenly text-sm font-semibold text-neutral-600">
          {['caption','mood','hashtags'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <section className="space-y-6">
          {activeTab === 'caption' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-700">
                Describe your image
              </label>
              <textarea
                rows={4}
                className="w-full p-4 rounded-md bg-white border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="E.g., A cozy coffee moment stirred with creativity"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
              />
              <button
                onClick={() =>
                  handleApi('/api/caption-generator', { imageDescription }, data => {
                    if (data.caption) setGeneratedCaption(data.caption)
                  })
                }
                disabled={loading || !imageDescription.trim()}
                className="w-full px-5 py-2.5 rounded-md bg-blue-600 text-white transition-opacity disabled:opacity-50"
              >
                {loading ? 'Generating…' : 'Generate Caption'}
              </button>
              {generatedCaption && (
                <div className="px-4 py-3 rounded-md bg-white shadow-sm space-y-2">
                  <p className="text-neutral-800 whitespace-pre-wrap">{generatedCaption}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCaption)
                      setCaptionCopied(true)
                      setTimeout(() => setCaptionCopied(false), 2000)
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {captionCopied ? 'Copied!' : 'Copy Caption'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'mood' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-700">
                Text to analyze
              </label>
              <textarea
                rows={4}
                className="w-full p-4 rounded-md bg-white border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Paste the text here..."
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
              />
              <button
                onClick={() =>
                  handleApi('/api/mood-checker', { text: textToAnalyze }, data => {
                    if (data.mood) setMoodResult(data)
                  })
                }
                disabled={loading || !textToAnalyze.trim()}
                className="w-full px-5 py-2.5 rounded-md bg-blue-600 text-white transition-opacity disabled:opacity-50"
              >
                {loading ? 'Analyzing…' : 'Check Mood'}
              </button>
              {moodResult && (
                <div className="px-4 py-4 rounded-md bg-white shadow-sm text-center space-y-1">
                  <div className="text-5xl leading-none">{moodResult.emoji}</div>
                  <div className="font-semibold text-lg capitalize text-neutral-800">
                    {moodResult.mood}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Confidence: {moodResult.confidence}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hashtags' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-700">
                Keywords
              </label>
              <input
                type="text"
                className="w-full p-4 rounded-md bg-white border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., nature travel food"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (
                  handleApi('/api/hashtag-suggestor', { keywords }, data => {
                    if (data.hashtags) setHashtags(data.hashtags)
                  })
                )}
              />
              <button
                onClick={() =>
                  handleApi('/api/hashtag-suggestor', { keywords }, data => {
                    if (data.hashtags) setHashtags(data.hashtags)
                  })
                }
                disabled={loading || !keywords.trim()}
                className="w-full px-5 py-2.5 rounded-md bg-blue-600 text-white transition-opacity disabled:opacity-50"
              >
                {loading ? 'Suggesting…' : 'Suggest Hashtags'}
              </button>
              {hashtags.length > 0 && (
                <div className="px-4 py-3 rounded-md bg-white shadow-sm space-y-2">
                  <div className="flex flex-wrap gap-2 text-sm text-neutral-800">
                    {hashtags.map((tag, idx) => (
                      <span key={idx} className="bg-neutral-200 px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hashtags.join(' '))
                      setHashtagsCopied(true)
                      setTimeout(() => setHashtagsCopied(false), 2000)
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {hashtagsCopied ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
