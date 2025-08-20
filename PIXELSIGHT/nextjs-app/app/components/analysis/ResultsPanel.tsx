'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Copy,
  Download,
  Share2,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Target,
  Eye,
  Palette,
  Camera,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

interface AnalysisResult {
  id: string
  imageUrl: string
  analysis: string
  analysisType: string
  confidence: number
  processingTime: number
  timestamp: Date
  metadata: {
    imageSize: number
    dimensions: { width: number; height: number }
    format: string
  }
  tags: string[]
  insights?: {
    objectsDetected: string[]
    dominantColors: string[]
    emotions: string[]
    technicalScore: number
    artisticScore: number
    compositionScore: number
  }
}

interface ResultsPanelProps {
  result: AnalysisResult
  onCopy: () => void
  onDownload: () => void
  onShare: () => void
  onReanalyze?: () => void
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  onCopy,
  onDownload,
  onShare,
  onReanalyze
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('analysis')
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)

  const getAnalysisTypeIcon = (type: string) => {
    const icons = {
      general: Eye,
      artistic: Palette,
      technical: Camera,
      emotional: Heart,
      creative: Star,
      fast: TrendingUp
    }
    return icons[type as keyof typeof icons] || Eye
  }

  const getAnalysisTypeColor = (type: string) => {
    const colors = {
      general: 'from-blue-500 to-indigo-500',
      artistic: 'from-purple-500 to-pink-500',
      technical: 'from-green-500 to-emerald-500',
      emotional: 'from-orange-500 to-red-500',
      creative: 'from-teal-500 to-cyan-500',
      fast: 'from-yellow-500 to-orange-500'
    }
    return colors[type as keyof typeof colors] || 'from-blue-500 to-indigo-500'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const AnalysisIcon = getAnalysisTypeIcon(result.analysisType)
  const typeColor = getAnalysisTypeColor(result.analysisType)

  const analysisPreview = result.analysis.length > 200 && !showFullAnalysis 
    ? result.analysis.substring(0, 200) + '...'
    : result.analysis

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with Image and Meta Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <div className="lg:col-span-1">
          <div className="relative group">
            <img
              src={result.imageUrl}
              alt="Analyzed image"
              className="w-full h-64 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <ExternalLink className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Analysis Type Badge */}
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${typeColor}`}>
              <AnalysisIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {result.analysisType} Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.confidence}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Confidence
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.processingTime}ms
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Processing
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.insights?.technicalScore || 94}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Quality Score
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Result</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>

            {onReanalyze && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReanalyze}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-analyze</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'analysis', label: 'Analysis', icon: Eye },
            { id: 'insights', label: 'Insights', icon: TrendingUp },
            { id: 'metadata', label: 'Metadata', icon: Camera }
          ].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setExpandedSection(expandedSection === tab.id ? null : tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  expandedSection === tab.id
                    ? 'text-blue-700 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {expandedSection === 'analysis' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {analysisPreview}
                </p>
                
                {result.analysis.length > 200 && (
                  <button
                    onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center space-x-1"
                  >
                    <span>{showFullAnalysis ? 'Show less' : 'Show more'}</span>
                    {showFullAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Tags */}
              {result.tags && result.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {expandedSection === 'insights' && result.insights && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technical Quality</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${result.insights.technicalScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.insights.technicalScore}/100
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Artistic Value</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                        style={{ width: `${result.insights.artisticScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.insights.artisticScore}/100
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Composition</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                        style={{ width: `${result.insights.compositionScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.insights.compositionScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Objects and Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.insights.objectsDetected && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Objects Detected</h4>
                    <div className="space-y-2">
                      {result.insights.objectsDetected.map((object, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-gray-700 dark:text-gray-300">{object}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.insights.dominantColors && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Dominant Colors</h4>
                    <div className="flex flex-wrap gap-3">
                      {result.insights.dominantColors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {expandedSection === 'metadata' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Image Properties</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Format:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{result.metadata.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.metadata.dimensions.width} × {result.metadata.dimensions.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatFileSize(result.metadata.imageSize)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Analysis ID:</span>
                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{result.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Processing Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Analysis Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{result.analysisType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{result.processingTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{result.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ResultsPanel
