'use client'

import React, { useEffect, useRef, useState } from 'react'

type MoodResult = {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetworkUI() {
  const [activeTab, setActiveTab] = useState<'caption' | 'mood' | 'hashtags'>('caption')
  const [loading, setLoading] = useState(false)

  // Caption states
  const [imageDescription, setImageDescription] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Mood states
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)

  // Hashtag states
  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  // Local history (simple helpful UX)
  const [history, setHistory] = useState<string[]>([])

  // Theme
  const [dark, setDark] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // hydrate history from localStorage
    const saved = typeof window !== 'undefined' ? localStorage.getItem('snai_history') : null
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('snai_history', JSON.stringify(history.slice(0, 30)))
  }, [history])

  // quick templates for captions
  const captionTones = ['Witty', 'Aesthetic', 'Travel', 'Foodie', 'Romantic', 'Motivational']

  const handleFile = (file: File | null) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    // try to seed description from filename (useful small UX):
    const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    if (!imageDescription.trim()) setImageDescription(name)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onPickFile = () => fileInputRef.current?.click()

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
      if (data.caption) {
        setGeneratedCaption(data.caption)
        setHistory(prev => [data.caption, ...prev.filter(h => h !== data.caption)])
      }
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
        body: JSON.stringify({ text: textToAnalyze })
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
        body: JSON.stringify({ keywords })
      })
      const data = await res.json()
      if (data.hashtags) {
        setHashtags(data.hashtags)
      }
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
      console.error('Copy failed', err)
      alert('Copy failed')
    }
  }
   const handleSharePage = async () => {
    const shareText = `Check out this Social Network AI demo by Syed Waheed`
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Social Network AI', text: shareText, url })
      } else {
        await navigator.clipboard.writeText(`${shareText} ${url}`)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Share failed', err)
      alert('Share failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#7c3aed] text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center ring-1 ring-white/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L15.5 8.5L22 12L15.5 15.5L12 22L8.5 15.5L2 12L8.5 8.5L12 2Z" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Social Network AI</h1>
              <p className="text-sm text-slate-300">Caption generator • Mood checker • Hashtag suggestor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 text-sm font-medium"
              onClick={() => { navigator.clipboard.writeText('Deployed with ♥ by Social Network AI') }}
            >
              Share
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 bg-white/6 p-4 rounded-2xl h-fit glass-card">
            <nav className="space-y-2">
              <NavItem id="caption" active={activeTab === 'caption'} onClick={() => setActiveTab('caption')}>📸 Caption</NavItem>
              <NavItem id="mood" active={activeTab === 'mood'} onClick={() => setActiveTab('mood')}>😊 Mood</NavItem>
              <NavItem id="hashtags" active={activeTab === 'hashtags'} onClick={() => setActiveTab('hashtags')}>#️⃣ Hashtags</NavItem>
            </nav>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-200 mb-2">Quick tips</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Use short descriptive phrases for better captions</li>
                <li>• Try different tones (Witty, Aesthetic)</li>
                <li>• Use keywords to get targeted hashtags</li>
              </ul>
            </div>

            {history.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-200 mb-2">Recent captions</h4>
                <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                  {history.map((h, i) => (
                    <button key={i} className="text-left text-sm p-2 rounded-md hover:bg-white/4 text-slate-200/90" onClick={() => { setGeneratedCaption(h); setActiveTab('caption') }}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="col-span-9 space-y-6">
            {/* Caption Card */}
            {activeTab === 'caption' && (
              <section className="glass-card p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">📸 Caption Generator</h2>
                    <p className="text-sm text-slate-300 mb-4">Describe your image (or drop a file) and get an IG-ready caption.</p>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDrop}
                      className="rounded-lg border-2 border-dashed border-white/6 p-4 bg-white/3"
                      aria-label="Image drop zone"
                    >
                      <div className="flex gap-3 items-center">
                        <button onClick={onPickFile} className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/8">Upload image</button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                        <input
                          className="flex-1 p-3 rounded-md bg-transparent border-0 outline-none text-slate-100 placeholder-slate-400"
                          placeholder="Describe the image (e.g. 'Sunset at the beach with friends')"
                          value={imageDescription}
                          onChange={(e) => setImageDescription(e.target.value)}
                        />
                        <button
                          onClick={() => { setImageDescription('')} }
                          title="Clear"
                          className="p-2 rounded-md hover:bg-white/6"
                        >
                          ×
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {captionTones.map((t) => (
                          <button key={t} onClick={() => setImageDescription(prev => (prev ? `${prev} — ${t}` : t))} className="text-xs px-3 py-1 rounded-full bg-white/8 hover:bg-white/12">
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={generateCaption}
                          disabled={loading || !imageDescription.trim()}
                          className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-semibold disabled:opacity-60"
                        >
                          {loading ? 'Generating…' : 'Generate Caption'}
                        </button>

                        <button
                          onClick={() => { setGeneratedCaption(''); setImagePreview(null); setImageDescription('') }}
                          className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/8"
                        >
                          Reset
                        </button>
                      </div>

                    </div>
                  </div>

                  <aside className="w-full md:w-80 p-3 rounded-lg bg-gradient-to-b from-white/4 to-transparent">
                    <div className="h-44 rounded-md overflow-hidden bg-black/30 flex items-center justify-center">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="preview" className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-slate-300 text-sm">Image preview will show here</div>
                      )}
                    </div>

                    {generatedCaption ? (
                      <div className="mt-4 bg-white/6 p-3 rounded-lg">
                        <p className="text-slate-100 leading-relaxed">{generatedCaption}</p>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => copyToClipboard(generatedCaption, 'caption')} className={`px-3 py-2 rounded-md text-sm ${captionCopied ? 'bg-emerald-500 text-white' : 'bg-white/8 hover:bg-white/12'}`}>
                            {captionCopied ? 'Copied ✓' : 'Copy'}
                          </button>
                          <button onClick={() => { navigator.share?.({ text: generatedCaption }) }} className="px-3 py-2 rounded-md bg-white/8 text-sm">
                            Share
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-xs text-slate-300">Tip: Keep descriptions crisp (5–12 words) for the best captions.</div>
                    )}
                  </aside>
                </div>
              </section>
            )}

            {/* Mood Card */}
            {activeTab === 'mood' && (
              <section className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold">😊 Mood Checker</h2>
                <p className="text-sm text-slate-300 mb-4">Paste text and instantly see the detected mood.</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <textarea
                      value={textToAnalyze}
                      onChange={(e) => setTextToAnalyze(e.target.value)}
                      placeholder="Paste a tweet, comment, or text here..."
                      className="w-full h-40 p-4 rounded-lg bg-transparent border border-white/6 text-slate-100 placeholder-slate-400 resize-none"
                    />

                    <div className="mt-4 flex gap-3">
                      <button onClick={checkMood} disabled={loading || !textToAnalyze.trim()} className="px-4 py-2 rounded-md bg-gradient-to-r from-sky-400 to-blue-600 text-black font-medium disabled:opacity-60">Check Mood</button>
                      <button onClick={() => { setTextToAnalyze(''); setMoodResult(null); }} className="px-3 py-2 rounded-md bg-white/8">Clear</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    {moodResult ? (
                      <div className="bg-white/6 p-6 rounded-3xl text-center w-full mood-ring">
                        <div className="text-6xl mb-2 animate-bounce">{moodResult.emoji}</div>
                        <div className="text-xl font-semibold capitalize">{moodResult.mood}</div>
                        <div className="text-sm text-slate-300 mt-1">Confidence: {moodResult.confidence}</div>
                      </div>
                    ) : (
                      <div className="text-slate-300 text-center">No mood detected yet. Try pasting some text!</div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Hashtag Card */}
            {activeTab === 'hashtags' && (
              <section className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold">#️⃣ Hashtag Suggestor</h2>
                <p className="text-sm text-slate-300 mb-4">Type keywords and get a curated list of hashtags.</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Enter keywords (e.g., travel photography nature)"
                      className="w-full p-3 rounded-lg bg-transparent border border-white/6 text-slate-100 placeholder-slate-400"
                      onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                    />

                    <div className="mt-4 flex gap-3">
                      <button onClick={suggestHashtags} disabled={loading || !keywords.trim()} className="px-4 py-2 rounded-md bg-gradient-to-r from-green-300 to-teal-400 text-black font-medium disabled:opacity-60">Suggest</button>
                      <button onClick={() => { setKeywords(''); setHashtags([]) }} className="px-3 py-2 rounded-md bg-white/8">Clear</button>
                    </div>

                    <div className="mt-4 text-sm text-slate-300">Popular quick keywords:</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['travel', 'food', 'fashion', 'fitness', 'nature', 'photography'].map((k) => (
                        <button key={k} onClick={() => setKeywords(prev => (prev ? `${prev} ${k}` : k))} className="text-xs px-3 py-1 rounded-full bg-white/8">{k}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="min-h-[160px] rounded-lg p-4 bg-white/6 flex flex-col gap-3">
                      {hashtags.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {hashtags.map((h, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm">{h}</span>
                            ))}
                          </div>

                          <div className="mt-auto flex gap-2">
                            <button onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')} className={`px-3 py-2 rounded-md ${hashtagsCopied ? 'bg-emerald-500 text-black' : 'bg-white/8'}`}>
                              {hashtagsCopied ? 'Copied ✓' : 'Copy All'}
                            </button>
                            <button onClick={() => navigator.share?.({ text: hashtags.join(' ') })} className="px-3 py-2 rounded-md bg-white/8">Share</button>
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-300">No hashtags yet — try entering a few keywords and press Suggest.</div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <footer className="fixed bottom-0 left-0 w-full text-center text-slate-300 text-xl py-3 bg-transparent">
  Made by Syed Abdul Waheed
</footer>

          </main>
        </div>
      </div>
    </div>
  )
}

function NavItem({ children, active = false, onClick }: { children: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full p-3 text-left rounded-lg flex items-center gap-3 ${active ? 'bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-semibold' : 'hover:bg-white/4'}`}>
      <span className="text-lg">{children}</span>
    </button>
  )
}
