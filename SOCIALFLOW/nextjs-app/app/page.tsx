"use client"

import { useState } from "react"
import { Copy, Check, MessageSquare, BarChart3, Hash, Sparkles } from "lucide-react"

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState("caption")
  const [loading, setLoading] = useState(false)

  // Caption Generator states
  const [imageDescription, setImageDescription] = useState("")
  const [generatedCaption, setGeneratedCaption] = useState("")
  const [captionCopied, setCaptionCopied] = useState(false)

  // Mood Checker states
  const [textToAnalyze, setTextToAnalyze] = useState("")
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)

  // Hashtag Suggestor states
  const [keywords, setKeywords] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  const generateCaption = async () => {
    if (!imageDescription.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/caption-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDescription }),
      })

      const data = await response.json()
      if (data.caption) {
        setGeneratedCaption(data.caption)
      }
    } catch (error) {
      console.error("Error generating caption:", error)
    }
    setLoading(false)
  }

  const checkMood = async () => {
    if (!textToAnalyze.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/mood-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze }),
      })

      const data = await response.json()
      if (data.mood) {
        setMoodResult(data)
      }
    } catch (error) {
      console.error("Error checking mood:", error)
    }
    setLoading(false)
  }

  const suggestHashtags = async () => {
    if (!keywords.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/hashtag-suggestor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      })

      const data = await response.json()
      if (data.hashtags) {
        setHashtags(data.hashtags)
      }
    } catch (error) {
      console.error("Error suggesting hashtags:", error)
    }
    setLoading(false)
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
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const tabs = [
    {
      id: "caption",
      label: "Caption Generator",
      icon: MessageSquare,
      description: "Generate engaging captions",
    },
    {
      id: "mood",
      label: "Sentiment Analysis",
      icon: BarChart3,
      description: "Analyze text sentiment",
    },
    {
      id: "hashtags",
      label: "Hashtag Suggestions",
      icon: Hash,
      description: "Discover trending tags",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Social AI Tools</h1>
          </div>
          <p className="text-gray-600 text-lg">AI-powered content creation for social media</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Caption Generator Tab */}
          {activeTab === "caption" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Caption Generator</h2>
                <p className="text-gray-600">Describe your image to generate engaging social media captions</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Description</label>
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Describe your image in detail..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                <button
                  onClick={generateCaption}
                  disabled={loading || !imageDescription.trim()}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                >
                  {loading ? "Generating..." : "Generate Caption"}
                </button>

                {generatedCaption && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Generated Caption</h3>
                      <button
                        onClick={() => copyToClipboard(generatedCaption, "caption")}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {captionCopied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{generatedCaption}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mood Checker Tab */}
          {activeTab === "mood" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Sentiment Analysis</h2>
                <p className="text-gray-600">Analyze the emotional tone and sentiment of any text</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text to Analyze</label>
                  <textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Paste your text here for sentiment analysis..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                <button
                  onClick={checkMood}
                  disabled={loading || !textToAnalyze.trim()}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                >
                  {loading ? "Analyzing..." : "Analyze Sentiment"}
                </button>

                {moodResult && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="text-center space-y-4">
                      <div className="text-4xl">{moodResult.emoji}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize mb-1">{moodResult.mood}</h3>
                        <p className="text-sm text-gray-600">Confidence: {moodResult.confidence}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hashtag Suggestor Tab */}
          {activeTab === "hashtags" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Hashtag Suggestions</h2>
                <p className="text-gray-600">Enter keywords to discover relevant and trending hashtags</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords separated by spaces..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-500"
                    onKeyDown={(e) => e.key === "Enter" && suggestHashtags()}
                  />
                </div>

                <button
                  onClick={suggestHashtags}
                  disabled={loading || !keywords.trim()}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                >
                  {loading ? "Finding Hashtags..." : "Suggest Hashtags"}
                </button>

                {hashtags.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Suggested Hashtags</h3>
                      <button
                        onClick={() => copyToClipboard(hashtags.join(" "), "hashtags")}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {hashtagsCopied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy All</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Optimize your content for Instagram, Twitter, TikTok, and more</p>
        </div>
      </div>
    </div>
  )
}
