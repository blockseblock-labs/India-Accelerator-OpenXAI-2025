'use client'

import { useState } from 'react'
import { Camera, Upload, Eye } from 'lucide-react'

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">PixelSight</h1>
          <p className="text-lg text-white/80">AI-powered image understanding in a click.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Image</h2>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-white/20 border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="max-h-52 max-w-full rounded-lg shadow-md ring-1 ring-white/20"
                    />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mb-3 text-white/70" />
                      <p className="mb-2 text-sm text-white/70">
                        <span className="font-semibold">Click to upload</span> or drag and drop
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
              
              {selectedImage && (
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow"
                >
                  {isAnalyzing ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                  ) : (
                    <Eye size={20} />
                  )}
                  <span>{isAnalyzing ? 'Analyzing…' : 'Analyze Image'}</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Analysis</h2>
            
            {analysis ? (
              <div className="bg-black/20 rounded-xl p-6 ring-1 ring-white/10">
                <p className="text-white/95 leading-relaxed">{analysis}</p>
              </div>
            ) : (
              <div className="text-center text-white/60 py-12">
                <Camera size={48} className="mx-auto mb-4" />
                <p>Upload an image and click "Analyze" to see AI-powered insights!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
} 