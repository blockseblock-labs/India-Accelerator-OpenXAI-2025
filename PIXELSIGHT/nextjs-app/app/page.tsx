'use client'

import { useState } from 'react'
import { Camera, Upload, Eye, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(true)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setFileInfo({ name: file.name, size: Math.round(file.size / 1024) }) // KB size
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
      setAnalysis('⚠️ Error analyzing image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-4">👁️ Vision Template</h1>
          <p className="text-xl opacity-90">Upload, Analyze & Discover insights!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Image</h2>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:bg-white/5 hover:border-emerald-400 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="max-h-48 max-w-full rounded-lg shadow-lg"
                    />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mb-3 text-white/70" />
                      <p className="mb-2 text-sm text-white/70">
                        <span className="font-semibold">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-white/50">PNG, JPG or JPEG</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {/* File Info */}
              {fileInfo && (
                <p className="text-sm text-white/70 text-center">
                  📂 {fileInfo.name} • {fileInfo.size} KB
                </p>
              )}
              
              {/* Analyze Button */}
              {selectedImage && (
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Eye size={20} />}
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Image'}</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
              {analysis && (
                <button
                  onClick={() => setShowResult(!showResult)}
                  className="text-white/70 hover:text-white"
                >
                  {showResult ? <ChevronUp /> : <ChevronDown />}
                </button>
              )}
            </div>
            
            {analysis && showResult ? (
              <div className="bg-black/20 rounded-lg p-6">
                <p className="text-white leading-relaxed">{analysis}</p>
              </div>
            ) : (
              <div className="text-center text-white/60 py-12">
                <Camera size={48} className="mx-auto mb-4" />
                <p>Upload an image and click "Analyze" to see AI-powered insights!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">🚀 Ready to build your vision app?</h3>
            <p className="text-white/80">This enhanced template gives you a smoother experience and is ready to connect with your AI backend.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
