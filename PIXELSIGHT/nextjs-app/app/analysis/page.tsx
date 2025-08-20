'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Download, Share2, Save } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import ImageUpload from '../components/analysis/ImageUpload'
import AnalysisOptions from '../components/analysis/AnalysisOptions'
import ResultsPanel from '../components/analysis/ResultsPanel'
import DetailedReport from '../components/analysis/DetailedReport'
import { AnalysisResult } from '../lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function AnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'results'>('upload')

  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData)
    setCurrentStep('analyze')
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setCurrentStep('results')
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setCurrentStep('upload')
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Image Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload an image and get detailed AI-powered insights
            </p>
          </div>
          
          {analysisResult && (
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                icon={<Save className="w-4 h-4" />}
              >
                Save Analysis
              </Button>
              <Button
                variant="ghost"
                icon={<Share2 className="w-4 h-4" />}
              >
                Share
              </Button>
              <Button
                variant="ghost"
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </Button>
            </div>
          )}
        </motion.div>

        {/* Progress Steps */}
        <motion.div variants={itemVariants} className="mt-6">
          <div className="flex items-center space-x-4">
            {[
              { id: 'upload', label: 'Upload Image', icon: Upload },
              { id: 'analyze', label: 'Analyze', icon: Sparkles },
              { id: 'results', label: 'Results', icon: Download }
            ].map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = ['upload', 'analyze'].includes(step.id) && currentStep === 'results'
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive 
                      ? 'text-blue-700 dark:text-blue-400' 
                      : isCompleted
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ImageUpload onImageSelect={handleImageSelect} />
            </motion.div>
          )}

          {currentStep === 'analyze' && selectedImage && (
            <motion.div
              key="analyze"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Selected Image
                  </h2>
                </CardHeader>
                <CardContent>
                  <img
                    src={selectedImage}
                    alt="Selected for analysis"
                    className="w-full h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                  />
                  <div className="mt-4 flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={resetAnalysis}
                    >
                      Change Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <AnalysisOptions
                imageData={selectedImage}
                onAnalysisComplete={handleAnalysisComplete}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </motion.div>
          )}

          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={resetAnalysis}
                >
                  Start New Analysis
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Analyzed Image
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={analysisResult.imageUrl}
                        alt="Analyzed"
                        className="w-full h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <ResultsPanel result={analysisResult} />
                </div>
              </div>

              <DetailedReport result={analysisResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
