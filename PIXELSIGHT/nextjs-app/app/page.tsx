'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Eye, Loader2, Sparkles, X, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setAnalysis(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    try {
      // Simulate API call with timeout for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would call your API:
      /*
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      })
      const data = await response.json()
      setAnalysis(data.analysis)
      */
      
      // Demo analysis result
      setAnalysis("✅ Image Analysis Complete:\n\n• Content: A professional workspace setup\n• Primary Objects: Laptop, notebook, coffee cup\n• Colors: Dominant blues and neutral tones\n• Lighting: Well-lit with natural light source from left\n• Estimated Time: Daytime\n• Ambiance: Professional, productive environment\n\nThis appears to be a modern workspace optimized for focus and productivity. The clean composition suggests an intentional setup, possibly for remote work or creative endeavors.")
    } catch (error) {
      console.error('Error analyzing image:', error)
      setAnalysis('❌ Error analyzing image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center text-white mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="text-sm font-medium text-cyan-300 bg-cyan-400/10 px-3 py-1 rounded-full">
              AI VISION PLATFORM
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Vision Intelligence
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Advanced image analysis powered by cutting-edge AI vision models
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {/* Image Upload Section */}
          <motion.div
            className={`rounded-2xl p-6 md:p-8 border transition ${
              dragOver 
                ? 'border-cyan-400 bg-cyan-400/10' 
                : 'border-white/10 bg-white/5'
            } backdrop-blur-xl shadow-2xl`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Upload Image</h2>
              {selectedImage && (
                <button 
                  onClick={clearImage}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Clear image"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="space-y-6">
              <label className="flex flex-col items-center justify-center w-full h-64 md:h-72 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all overflow-hidden relative">
                <div className="flex flex-col items-center justify-center h-full px-4 z-10">
                  {selectedImage ? (
                    <motion.div 
                      className="relative h-full w-full flex items-center justify-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-h-52 md:max-h-60 max-w-full rounded-lg shadow-2xl object-contain"
                      />
                    </motion.div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-cyan-400/10 mb-4">
                        <Upload className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                      </div>
                      <p className="mb-2 text-sm md:text-base text-white/80 text-center">
                        <span className="font-semibold">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-white/50">Supports JPG, PNG, WebP</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl font-medium transition-all"
                >
                  <Upload size={18} />
                  <span>{selectedImage ? 'Change Image' : 'Select Image'}</span>
                </button>
                
                {selectedImage && (
                  <motion.button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all"
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Eye size={18} />
                    )}
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Image'}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Analysis Results</h2>
              {analysis && (
                <button className="text-white/60 hover:text-white transition-colors" aria-label="Download results">
                  <Download size={20} />
                </button>
              )}
            </div>

            <div className="h-64 md:h-72 rounded-xl overflow-hidden">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-white/70">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 mb-4"
                  ></motion.div>
                  <p className="text-center">
                    <span className="block font-medium">Processing with AI</span>
                    <span className="text-sm opacity-70">This may take a moment...</span>
                  </p>
                </div>
              ) : analysis ? (
                <motion.div
                  className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 md:p-6 border border-cyan-400/20 text-white leading-relaxed overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="font-sans space-y-3">
                    {analysis.split('\n\n').map((paragraph, i) => (
                      <p key={i} className={i === 0 ? "text-cyan-300 font-semibold" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/60 p-4 text-center">
                  <div className="p-3 rounded-full bg-white/5 mb-4">
                    <Camera size={32} className="opacity-50" />
                  </div>
                  <p className="mb-1 font-medium">Awaiting Analysis</p>
                  <p className="text-sm max-w-xs">Upload an image and click analyze to see AI-powered insights</p>
                </div>
              )}
            </div>
            
            {analysis && (
              <div className="mt-6 flex items-center text-xs text-cyan-300/70">
                <Sparkles size={14} className="mr-1" />
                <span>Powered by Llama 3 Vision AI • Confidence: 94%</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 md:mt-16 text-center bg-black/20 rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-lg border border-white/5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Transform Visual Data Into Insights
          </h3>
          <p className="text-white/70 max-w-3xl mx-auto text-sm md:text-base">
            Vision Intelligence leverages state-of-the-art AI models to analyze and interpret visual content. 
            From object detection to scene understanding, our platform provides actionable insights for 
            developers, researchers, and businesses.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {['Object Recognition', 'Scene Analysis', 'Content Description', 'Pattern Detection'].map((feature, i) => (
              <div key={i} className="px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs md:text-sm">
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}