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

  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setGeneratedCaption(`Capturing this beautiful moment! ${imageDescription} ✨ #Memories`)
    } catch (error) {
      console.error('Error generating caption:', error)
    }
    setLoading(false)
  }

  const checkMood = async () => {
    if (!textToAnalyze.trim()) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMoodResult({
        mood: 'positive',
        emoji: '😊',
        confidence: '92%'
      })
    } catch (error) {
      console.error('Error checking mood:', error)
    }
    setLoading(false)
  }

  const suggestHashtags = async () => {
    if (!keywords.trim()) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setHashtags(['#SocialMedia', '#AI', '#Tech', '#Innovation', '#Digital'])
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float 15s ease-in-out ${i * 0.5}s infinite`
          }}
        ></div>
      ))}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-full mb-4">
            <div className="bg-slate-900 rounded-full p-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">✈</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Social AI Studio
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            Premium AI-powered tools to enhance your social media presence
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 flex space-x-1 border border-slate-700/50 shadow-2xl">
            {[
              { id: 'caption', label: 'Caption Generator', desc: 'Create engaging captions', icon: '📸' },
              { id: 'mood', label: 'Mood Analyzer', desc: 'Detect sentiment', icon: '😊' },
              { id: 'hashtags', label: 'Hashtag Suggestor', desc: 'Find trending tags', icon: '#' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-xl transition-all duration-300 flex flex-col items-center min-w-[180px] ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-2xl mb-2">{tab.icon}</span>
                <div className="font-semibold">{tab.label}</div>
                <div className="text-xs opacity-75 mt-1">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Caption Generator Tab */}
          {activeTab === 'caption' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">📸</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Caption Generator</h2>
                    <p className="text-slate-400">Create engaging captions for your images</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 mb-2">Describe your image</label>
                    <textarea
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder="Beautiful sunset at the beach with golden sand and crashing waves..."
                      className="w-full h-32 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 resize-none transition-all"
                    />
                  </div>
                  
                  <button
                    onClick={generateCaption}
                    disabled={loading || !imageDescription.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>Generate Caption <span className="ml-2 text-xl">✨</span></>
                    )}
                  </button>

                  {generatedCaption && (
                    <div className="bg-slate-700/30 rounded-xl p-6 space-y-4 border border-slate-600/50">
                      <h3 className="font-semibold text-white text-lg flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Your Generated Caption
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                        {generatedCaption}
                      </p>
                      <button
                        onClick={() => copyToClipboard(generatedCaption, 'caption')}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center ${
                          captionCopied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-700/50 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {captionCopied ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy Caption
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mood Checker Tab */}
          {activeTab === 'mood' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">😊</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Mood Analyzer</h2>
                    <p className="text-slate-400">Detect the sentiment of any text</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 mb-2">Text to analyze</label>
                    <textarea
                      value={textToAnalyze}
                      onChange={(e) => setTextToAnalyze(e.target.value)}
                      placeholder="Paste a tweet, comment, or any text here to analyze its sentiment..."
                      className="w-full h-32 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 resize-none transition-all"
                    />
                  </div>
                  
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>Analyze Mood <span className="ml-2">🔍</span></>
                    )}
                  </button>

                  {moodResult && (
                    <div className="bg-slate-700/30 rounded-xl p-8 text-center space-y-6 border border-slate-600/50">
                      <div className="text-7xl animate-bounce">{moodResult.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white capitalize mb-2">{moodResult.mood}</h3>
                        <p className="text-slate-300">Detected sentiment with <span className="font-semibold text-blue-400">{moodResult.confidence}</span> confidence</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hashtag Suggestor Tab */}
          {activeTab === 'hashtags' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">#</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hashtag Suggestor</h2>
                    <p className="text-slate-400">Find trending hashtags for your content</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 mb-2">Keywords</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Enter keywords related to your content (e.g., travel photography nature)"
                      className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                    />
                  </div>
                  
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Finding Hashtags...
                      </>
                    ) : (
                      <>Suggest Hashtags <span className="ml-2">🏷️</span></>
                    )}
                  </button>

                  {hashtags.length > 0 && (
                    <div className="bg-slate-700/30 rounded-xl p-6 space-y-5 border border-slate-600/50">
                      <h3 className="font-semibold text-white text-lg flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Suggested Hashtags
                      </h3>
                      
                      <div className="flex flex-wrap gap-3">
                        {hashtags.map((hashtag, index) => (
                          <span 
                            key={index} 
                            className="px-4 py-2 bg-slate-700/50 text-white rounded-full border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500/50 transition-all cursor-pointer"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center ${
                          hashtagsCopied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-700/50 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {hashtagsCopied ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy All Hashtags
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-400">
          <p>Elevate your social media presence with AI-powered tools</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
