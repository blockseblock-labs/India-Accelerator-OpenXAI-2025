'use client'

import { useState } from 'react'
import { Camera, Upload, Eye, Zap, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
      setAnalysis('❌ Error analyzing image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadPDF = async () => {
    if (!selectedImage || !analysis) return

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Add title
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('🎮 PIXEL SIGHT - AI Analysis Report', pageWidth / 2, 20, { align: 'center' })
      
      // Add date
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const date = new Date().toLocaleDateString()
      pdf.text(`Generated on: ${date}`, pageWidth / 2, 30, { align: 'center' })
      
      let yPosition = 50
      
      // Add image if available
      if (selectedImage) {
        try {
          // Convert base64 to image and add to PDF
          const imgData = selectedImage
          const imgWidth = 120
          const imgHeight = 80
          const xPosition = (pageWidth - imgWidth) / 2
          
          pdf.addImage(imgData, 'JPEG', xPosition, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 20
        } catch (imgError) {
          console.error('Error adding image to PDF:', imgError)
        }
      }
      
      // Add analysis section
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('🤖 AI Analysis:', 20, yPosition)
      yPosition += 15
      
      // Add analysis text with word wrapping
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      const splitAnalysis = pdf.splitTextToSize(analysis, pageWidth - 40)
      
      for (let i = 0; i < splitAnalysis.length; i++) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(splitAnalysis[i], 20, yPosition)
        yPosition += 6
      }
      
      // Add footer
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.text('Made with ❤️ by Samarth Ghante', pageWidth / 2, pageHeight - 10, { align: 'center' })
      
      // Save the PDF
      pdf.save('pixel-sight-analysis.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white border-8 border-blue-600 rounded-3xl p-4 md:p-8 shadow-2xl transform hover:scale-105 transition-transform">
            <h1 className="text-4xl md:text-7xl font-black text-blue-900 mb-4 tracking-wider" style={{fontFamily: 'Impact, Arial Black, sans-serif'}}>
              🎮 PIXEL SIGHT
            </h1>
            <p className="text-lg md:text-2xl font-bold text-blue-700 tracking-wide">
              🚀 AI-POWERED IMAGE ANALYSIS 🚀
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
          {/* Image Upload Section */}
          <div className="bg-white border-8 border-blue-600 rounded-3xl p-4 md:p-8 shadow-2xl">
            <div className="bg-blue-600 text-white text-center py-3 md:py-4 rounded-2xl mb-4 md:mb-6 border-4 border-blue-800">
              <h2 className="text-xl md:text-3xl font-black tracking-wider" style={{fontFamily: 'Impact, Arial Black, sans-serif'}}>
                📸 UPLOAD ZONE
              </h2>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <label className="flex flex-col items-center justify-center w-full h-64 md:h-80 border-8 border-dashed border-blue-400 rounded-2xl cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  {selectedImage ? (
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="max-h-48 md:max-h-64 max-w-full rounded-xl border-4 border-blue-400 shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 border-4 border-white">
                        ✓
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 md:w-16 md:h-16 mb-4 text-blue-600" strokeWidth={3} />
                      <p className="mb-2 text-lg md:text-xl font-bold text-blue-800 text-center">
                        🎯 DROP YOUR IMAGE HERE!
                      </p>
                      <p className="text-sm md:text-lg text-blue-600 font-semibold">PNG, JPG or JPEG</p>
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
                  className="w-full flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-600 text-white px-4 md:px-8 py-4 md:py-6 rounded-2xl font-black text-lg md:text-2xl transition-all transform hover:scale-105 border-4 border-blue-900 shadow-xl"
                  style={{fontFamily: 'Impact, Arial Black, sans-serif'}}
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="animate-spin" size={24} />
                      <span className="hidden sm:inline">🔍 ANALYZING...</span>
                      <span className="sm:hidden">🔍 ANALYZING</span>
                    </>
                  ) : (
                    <>
                      <Eye size={24} />
                      <span className="hidden sm:inline">🚀 ANALYZE IMAGE!</span>
                      <span className="sm:hidden">🚀 ANALYZE</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="bg-white border-8 border-blue-600 rounded-3xl p-4 md:p-8 shadow-2xl">
            <div className="bg-blue-600 text-white text-center py-3 md:py-4 rounded-2xl mb-4 md:mb-6 border-4 border-blue-800">
              <h2 className="text-xl md:text-3xl font-black tracking-wider" style={{fontFamily: 'Impact, Arial Black, sans-serif'}}>
                🤖 AI ANALYSIS
              </h2>
            </div>
            
            {analysis ? (
              <div className="bg-gradient-to-br from-blue-50 to-white border-4 border-blue-300 rounded-2xl p-4 md:p-6 shadow-inner">
                <div className="bg-white border-4 border-blue-200 rounded-xl p-4 md:p-6 shadow-lg max-h-96 md:max-h-[500px] overflow-y-auto">
                  <div className="prose prose-blue max-w-none">
                    <div className="text-blue-900 leading-relaxed text-sm md:text-lg font-medium whitespace-pre-wrap break-words">
                      {analysis.split('\n').map((paragraph, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                          {paragraph.trim() && (
                            <p className="mb-2 last:mb-0">{paragraph}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="bg-green-500 text-white px-4 md:px-6 py-2 rounded-full border-4 border-green-700 font-bold text-sm md:text-base">
                    ⭐ ANALYSIS COMPLETE! ⭐
                  </div>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-4 md:px-6 py-2 md:py-3 rounded-full border-4 border-purple-900 font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-lg"
                    style={{fontFamily: 'Impact, Arial Black, sans-serif'}}
                  >
                    <Download size={18} />
                    <span>📄 DOWNLOAD PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-blue-600 py-12 md:py-16 border-4 border-dashed border-blue-300 rounded-2xl bg-blue-50">
                <Camera size={48} className="mx-auto mb-4 md:mb-6 text-blue-400 md:w-16 md:h-16" strokeWidth={2} />
                <p className="text-lg md:text-2xl font-bold mb-2">🎮 READY FOR ACTION!</p>
                <p className="text-sm md:text-lg font-semibold px-4">Upload an image and start analyzing!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="bg-white border-8 border-blue-600 rounded-3xl p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <span className="text-lg md:text-2xl font-black text-blue-900" style={{fontFamily: 'Impact, Arial Black, sans-serif'}}>
                MADE W/
              </span>
              <span className="text-2xl md:text-3xl">❤️</span>
              <span className="text-lg md:text-2xl font-black text-blue-900" style={{fontFamily: 'Impact, Arial Black, sans-serif'}}>
                BY
              </span>
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 md:px-4 py-1 md:py-2 rounded-full border-4 border-blue-900 shadow-lg transform hover:scale-105 transition-transform">
                <span className="text-lg md:text-xl font-black tracking-wider" style={{fontFamily: 'Impact, Arial Black, sans-serif'}}>
                  SAMARTH GHANTE
                </span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  )
} 