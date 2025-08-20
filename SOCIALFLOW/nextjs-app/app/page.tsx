"use client"

import { useState } from "react"

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState("caption")
  const [loading, setLoading] = useState(false)

  const [imageDescription, setImageDescription] = useState("")
  const [generatedCaption, setGeneratedCaption] = useState("")
  const [captionCopied, setCaptionCopied] = useState(false)

  const [textToAnalyze, setTextToAnalyze] = useState("")
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)

  const [keywords, setKeywords] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/caption-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDescription }),
      })
      const data = await res.json()
      if (data.caption) setGeneratedCaption(data.caption)
    } finally {
      setLoading(false)
    }
  }

  const checkMood = async () => {
    if (!textToAnalyze.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/mood-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze }),
      })
      const data = await res.json()
      if (data.mood) setMoodResult(data)
    } finally {
      setLoading(false)
    }
  }

  const suggestHashtags = async () => {
    if (!keywords.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/hashtag-suggestor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      })
      const data = await res.json()
      if (data.hashtags) setHashtags(data.hashtags)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: "caption" | "hashtags") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "caption") {
        setCaptionCopied(true)
        setTimeout(() => setCaptionCopied(false), 2000)
      } else {
        setHashtagsCopied(true)
        setTimeout(() => setHashtagsCopied(false), 2000)
      }
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Social Network AI
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
            Smart tools for captions, moods, and hashtags — designed to boost your
            social presence effortlessly.
          </p>
        </header>

        {/* Tabs */}
<nav className="flex justify-center mb-10 border-b border-gray-200">
  {[
    { id: "caption", label: "Caption 📸" },
    { id: "mood", label: "Mood 😊" },
    { id: "hashtags", label: "Hashtags #️⃣" },
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium -mb-[1px] border-b-2 transition-colors ${
        activeTab === tab.id
          ? "border-gray-800 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
      }`}
    >
      {tab.label}
    </button>
  ))}
</nav>


        {/* Content */}
        <main className="space-y-12">
          {/* Caption Generator */}
          {activeTab === "caption" && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Caption Generator
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Describe your image and let AI generate a creative caption for
                Instagram, TikTok, or Twitter.
              </p>

              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="e.g., Sunset at the beach with friends"
                className="w-full h-28 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:outline-none text-base"
              />
              <button
                onClick={generateCaption}
                disabled={loading || !imageDescription.trim()}
                className="mt-5 w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Caption"}
              </button>

              {generatedCaption && (
                <div className="mt-8 bg-gray-50 border rounded-md p-5">
                  <h3 className="font-medium mb-2">Generated Caption:</h3>
                  <p className="text-lg leading-relaxed">{generatedCaption}</p>
                  <button
                    onClick={() => copyToClipboard(generatedCaption, "caption")}
                    className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {captionCopied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Mood Checker */}
          {activeTab === "mood" && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Mood Checker
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Paste text like a tweet, comment, or note — and instantly detect
                its emotional sentiment.
              </p>

              <textarea
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
                placeholder="Paste text here..."
                className="w-full h-28 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:outline-none text-base"
              />
              <button
                onClick={checkMood}
                disabled={loading || !textToAnalyze.trim()}
                className="mt-5 w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Check Mood"}
              </button>

              {moodResult && (
                <div className="mt-8 text-center">
                  <div className="text-5xl">{moodResult.emoji}</div>
                  <h3 className="mt-3 text-xl font-semibold capitalize">
                    {moodResult.mood}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Confidence: {moodResult.confidence}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Hashtag Suggestor */}
          {activeTab === "hashtags" && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Hashtag Suggestor
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Provide some keywords and get trending hashtags for your posts.
              </p>

              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., travel photography nature"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:outline-none text-base"
                onKeyDown={(e) => e.key === "Enter" && suggestHashtags()}
              />
              <button
                onClick={suggestHashtags}
                disabled={loading || !keywords.trim()}
                className="mt-5 w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition disabled:opacity-50"
              >
                {loading ? "Finding..." : "Suggest Hashtags"}
              </button>

              {hashtags.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Suggested Hashtags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(hashtags.map((h) => `#${h}`).join(" "), "hashtags")
                    }
                    className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {hashtagsCopied ? "Copied ✓" : "Copy All"}
                  </button>
                </div>
              )}
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-gray-400">
          <p>Made for Instagram, Twitter, TikTok & beyond 🚀</p>
        </footer>
      </div>
    </div>
  )
}
