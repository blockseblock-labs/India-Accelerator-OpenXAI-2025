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
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)
  
  // Mood Checker states
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)
  
  // Hashtag Suggestor states
  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  // Post Rewriter states
  const [postText, setPostText] = useState('')
  const [rewrittenPost, setRewrittenPost] = useState('')

  // Engagement Predictor states
  const [engagementText, setEngagementText] = useState('')
  const [engagementPrediction, setEngagementPrediction] = useState<string | null>(null)

  // ---- API Calls ----
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
        body: JSON.stringify({ text: textToAnalyze })
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
        body: JSON.stringify({ keywords })
      })
      const data = await response.json()
      if (data.hashtags) setHashtags(data.hashtags)
    } catch (error) {
      console.error('Error suggesting hashtags:', error)
    }
    setLoading(false)
  }

  const rewritePost = async () => {
    if (!postText.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/post-rewriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: postText })
      })
      const data = await response.json()
      if (data.rewritten) setRewrittenPost(data.rewritten)
    } catch (error) {
      console.error('Error rewriting post:', error)
    }
    setLoading(false)
  }

  const predictEngagement = async () => {
    if (!engagementText.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/engagement-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: engagementText })
      })
      const data = await response.json()
      if (data.prediction) setEngagementPrediction(data.prediction)
    } catch (error) {
      console.error('Error predicting engagement:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💬 Social Network AI</h1>
          <p className="text-white/80 text-lg">AI-Powered Social Media Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {[
              { id: 'caption', label: '📸 Caption', desc: 'Generate Captions', gradient: 'instagram-gradient' },
              { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment', gradient: 'twitter-gradient' },
              { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags', gradient: 'social-gradient' },
              { id: 'rewriter', label: '✍️ Rewriter', desc: 'Rewrite Posts', gradient: 'linkedin-gradient' },
              { id: 'engagement', label: '📊 Engagement', desc: 'Predict Reach', gradient: 'tiktok-gradient' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? `${tab.gradient} text-white shadow-lg scale-105`
                    : 'text-white hover:bg-white/10'
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
          
          {/* Caption Generator */}
          {activeTab === 'caption' && (
            <div className="social-card rounded-xl p-6 bg-white/10 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4">📸 Caption Generator</h2>
              <p className="text-white/80 mb-6">Enter an image description and get a catchy caption!</p>

              <input
                type="text"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Describe your image..."
                className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 mb-4"
              />

              <button
                onClick={generateCaption}
                disabled={loading || !imageDescription.trim()}
                className="w-full px-6 py-3 instagram-gradient text-white rounded-lg font-medium"
              >
                {loading ? 'Generating...' : 'Generate Caption ✨'}
              </button>

              {generatedCaption && (
                <div className="bg-white/20 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-white mb-2">Generated Caption:</h3>
                  <p className="text-white/90 text-lg">{generatedCaption}</p>
                  <button
                    onClick={() => copyToClipboard(generatedCaption, 'caption')}
                    className="mt-3 px-4 py-2 bg-white/30 rounded-md text-white hover:bg-white/40"
                  >
                    {captionCopied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mood Checker */}
          {activeTab === 'mood' && (
            <div className="social-card rounded-xl p-6 bg-white/10 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4">😊 Mood Checker</h2>
              <p className="text-white/80 mb-6">Analyze the sentiment of your text.</p>

              <textarea
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
                placeholder="Paste your post text here..."
                className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none mb-4"
              />

              <button
                onClick={checkMood}
                disabled={loading || !textToAnalyze.trim()}
                className="w-full px-6 py-3 twitter-gradient text-white rounded-lg font-medium"
              >
                {loading ? 'Analyzing...' : 'Check Mood 🔍'}
              </button>

              {moodResult && (
                <div className="bg-white/20 rounded-lg p-6 mt-4 text-center">
                  <div className="text-5xl">{moodResult.emoji}</div>
                  <h3 className="text-2xl font-bold text-white mt-2">{moodResult.mood}</h3>
                  <p className="text-white/80">Confidence: {moodResult.confidence}</p>
                </div>
              )}
            </div>
          )}

          {/* Hashtag Suggestor */}
          {activeTab === 'hashtags' && (
            <div className="social-card rounded-xl p-6 bg-white/10 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4">#️⃣ Hashtag Suggestor</h2>
              <p className="text-white/80 mb-6">Enter some keywords and get suggested hashtags.</p>

              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords (e.g. travel, food)"
                className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 mb-4"
              />

              <button
                onClick={suggestHashtags}
                disabled={loading || !keywords.trim()}
                className="w-full px-6 py-3 social-gradient text-white rounded-lg font-medium"
              >
                {loading ? 'Suggesting...' : 'Get Hashtags 🔥'}
              </button>

              {hashtags.length > 0 && (
                <div className="bg-white/20 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-white mb-2">Suggested Hashtags:</h3>
                  <p className="text-white/90 text-lg space-x-2">
                    {hashtags.map((tag, idx) => (
                      <span key={idx}>#{tag}</span>
                    ))}
                  </p>
                  <button
                    onClick={() => copyToClipboard(hashtags.map(h => `#${h}`).join(' '), 'hashtags')}
                    className="mt-3 px-4 py-2 bg-white/30 rounded-md text-white hover:bg-white/40"
                  >
                    {hashtagsCopied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Post Rewriter (already had UI) */}
          {activeTab === 'rewriter' && (
            <div className="social-card rounded-xl p-6 bg-white/10 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4">✍️ Post Rewriter</h2>
              <p className="text-white/80 mb-6">Make your posts more engaging!</p>
              
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Write your post here..."
                className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
              />
              
              <button
                onClick={rewritePost}
                disabled={loading || !postText.trim()}
                className="w-full px-6 py-3 linkedin-gradient text-white rounded-lg font-medium mt-4"
              >
                {loading ? 'Rewriting...' : 'Rewrite Post ✨'}
              </button>

              {rewrittenPost && (
                <div className="bg-white/20 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-white">Rewritten Post:</h3>
                  <p className="text-white/90 text-lg">{rewrittenPost}</p>
                </div>
              )}
            </div>
          )}

          {/* Engagement Predictor (already had UI, kept consistent) */}
          {activeTab === 'engagement' && (
            <div className="social-card rounded-xl p-6 bg-white/10 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4">📊 Engagement Predictor</h2>
              <p className="text-white/80 mb-6">Predict if your post will perform well!</p>
              
              <textarea
                value={engagementText}
                onChange={(e) => setEngagementText(e.target.value)}
                placeholder="Paste your caption or post..."
                className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
              />
              
              <button
                onClick={predictEngagement}
                disabled={loading || !engagementText.trim()}
                className="w-full px-6 py-3 tiktok-gradient text-white rounded-lg font-medium mt-4"
              >
                {loading ? 'Predicting...' : 'Predict Engagement 🚀'}
              </button>

              {engagementPrediction && (
                <div className="bg-white/20 rounded-lg p-4 mt-4 text-center">
                  <h3 className="text-2xl font-bold text-white">{engagementPrediction}</h3>
                  <p className="text-white/80">Estimated audience response</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p>Perfect for Instagram, Twitter, TikTok, LinkedIn and more! 🚀</p>
        </div>
      </div>
    </div>
  )
}
// CSS styles for gradients