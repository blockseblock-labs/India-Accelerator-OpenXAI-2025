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
    <main className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-4">👁️ Vision Template</h1>
          <p className="text-xl opacity-90">Analyze images with AI vision!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Image</h2>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/30 border-dashed rounded-lg cursor-pointer hover:bg-white/5">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="max-h-48 max-w-full rounded-lg"
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
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Eye size={20} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Image'}</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Analysis Results</h2>
            
            {analysis ? (
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
        
        <div className="mt-12 text-center">
          <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to build your vision app?</h3>
            <p className="text-white/80">This template includes everything you need to get started with computer vision and image analysis.</p>
          </div>
        </div>
      </div>
    </main>
  )
} 