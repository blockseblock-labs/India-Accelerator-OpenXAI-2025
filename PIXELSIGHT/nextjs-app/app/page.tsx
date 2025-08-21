'use client'

import { useState } from 'react'
import { Camera, Upload, Eye, Sparkles, Zap } from 'lucide-react'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      })
      
      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setAnalysis('Error analyzing image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/12 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-indigo-500/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500/12 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/6 right-1/3 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-pulse delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/6 w-88 h-88 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 px-4 pb-4 pt-2" style={{lineHeight: '1.2'}}>
                PixelSight
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transform your images into insights with cutting-edge AI vision technology. 
              Upload any image and discover what our AI sees.
            </p>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Upload Section */}
            <div className="group">
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-gray-800/60">
                <div className="flex items-center gap-3 mb-8">
                  <Upload className="w-6 h-6 text-gray-300" />
                  <h2 className="text-2xl font-bold text-white">Upload Image</h2>
                </div>
                
                <div className="space-y-6">
                  <label className="relative block">
                    <div className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-600/50 rounded-2xl cursor-pointer transition-all duration-300 hover:border-gray-500/70 hover:bg-gray-800/30 group-hover:border-gray-400/60">
                      {selectedImage ? (
                        <div className="relative w-full h-full p-4">
                          <img 
                            src={selectedImage} 
                            alt="Selected" 
                            className="w-full h-full object-contain rounded-xl shadow-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">Choose an image</h3>
                          <p className="text-gray-400 mb-4">
                            Drag and drop your image here, or click to browse
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20">
                            <span className="text-sm text-gray-300">PNG, JPG, JPEG</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  
                  {selectedImage && (
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:via-indigo-500 hover:to-sky-500 disabled:from-gray-700 disabled:via-gray-700 disabled:to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {isAnalyzing ? (
                          <>
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                            </div>
                            <span>Analyzing Magic...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            <span>Analyze with AI</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="group">
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-gray-800/60 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <Eye className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">AI Analysis</h2>
                </div>
                
                <div className="h-full">
                  {analysis ? (
                    <div className="relative">
                      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-3">What I see:</h3>
                            <p className="text-gray-200 leading-relaxed text-lg">{analysis}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Confidence indicator */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full"></div>
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">High confidence analysis</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[300px]">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-700/30 to-slate-700/30 rounded-3xl flex items-center justify-center border border-gray-600/30">
                          <Camera className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Ready for Analysis</h3>
                        <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                          Upload an image and click "Analyze with AI" to see what our advanced vision model discovers
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Get instant AI analysis results", gradient: "from-blue-500 to-blue-600" },
              { icon: Eye, title: "Deep Vision", desc: "Advanced computer vision technology", gradient: "from-indigo-500 to-indigo-600" },
              { icon: Sparkles, title: "Smart Insights", desc: "Detailed scene understanding", gradient: "from-sky-500 to-sky-600" }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/40 hover:bg-gray-800/50 transition-all duration-300 group hover:scale-105">
                <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 