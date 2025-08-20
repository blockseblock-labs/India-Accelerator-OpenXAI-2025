'use client'
import { useState } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import {
  Eye,
  Palette,
  Camera,
  Brain,
  Sparkles,
  Zap,
  Settings,
  ChevronDown,
} from 'lucide-react'

interface AnalysisOption {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  features: string[]
  processingTime: string
  accuracy: string
}

interface AnalysisOptionsProps extends HTMLMotionProps<'div'> {
  selectedType: string
  onTypeSelect: (type: string) => void
  onAnalyze: () => void
  isAnalyzing?: boolean
  imageSelected?: boolean
}

const analysisOptions: AnalysisOption[] = [
  {
    id: 'general',
    name: 'General Analysis',
    description:
      'Comprehensive overview of image content, objects, and composition',
    icon: Eye,
    color: 'from-blue-500 to-indigo-500',
    features: [
      'Object Detection',
      'Scene Recognition',
      'Color Analysis',
      'Basic Composition',
    ],
    processingTime: '2-3s',
    accuracy: '95%',
  },
  {
    id: 'artistic',
    name: 'Artistic Analysis',
    description:
      'Deep dive into artistic elements, style, and aesthetic qualities',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Style Detection',
      'Artistic Movement',
      'Color Harmony',
      'Visual Balance',
    ],
    processingTime: '3-4s',
    accuracy: '92%',
  },
  {
    id: 'technical',
    name: 'Technical Analysis',
    description: 'Technical aspects including quality, exposure, and metadata',
    icon: Camera,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Quality Assessment',
      'Exposure Analysis',
      'Metadata Extraction',
      'Technical Metrics',
    ],
    processingTime: '1-2s',
    accuracy: '98%',
  },
  {
    id: 'emotional',
    name: 'Emotional Impact',
    description: 'Analyze emotional response and psychological impact of imagery',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    features: [
      'Emotion Detection',
      'Mood Analysis',
      'Psychological Impact',
      'Viewer Response',
    ],
    processingTime: '4-5s',
    accuracy: '89%',
  },
  {
    id: 'creative',
    name: 'Creative Insights',
    description:
      'Innovative perspectives and creative suggestions for improvement',
    icon: Sparkles,
    color: 'from-teal-500 to-cyan-500',
    features: [
      'Creative Suggestions',
      'Enhancement Ideas',
      'Alternative Perspectives',
      'Inspiration',
    ],
    processingTime: '3-4s',
    accuracy: '87%',
  },
  {
    id: 'fast',
    name: 'Quick Scan',
    description: 'Rapid analysis for immediate insights and basic information',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Quick Overview',
      'Basic Objects',
      'Simple Description',
      'Instant Results',
    ],
    processingTime: '<1s',
    accuracy: '93%',
  },
]

const AnalysisOptions = ({
  selectedType,
  onTypeSelect,
  onAnalyze,
  isAnalyzing = false,
  imageSelected = false,
  ...props
}: AnalysisOptionsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [analysisDepth, setAnalysisDepth] = useState('standard')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState(75)

  const selectedOption = analysisOptions.find(
    (option) => option.id === selectedType
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
      {...props}
    >
      {/* Analysis Type Selection */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Choose Analysis Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedType === option.id

            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTypeSelect(option.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  isSelected
                    ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-lg`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{option.name}</h4>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected
                          ? 'text-white/80'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {option.description}
                    </p>

                    <div
                      className={`flex items-center justify-between mt-2 text-xs ${
                        isSelected
                          ? 'text-white/70'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <span>{option.processingTime}</span>
                      <span>{option.accuracy}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Selected Option Details */}
      {selectedOption && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${selectedOption.color}`}
            >
              {(() => {
                const SelectedIcon = selectedOption.icon
                return <SelectedIcon className="w-5 h-5 text-white" />
              })()}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedOption.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedOption.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {selectedOption.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400">
                Processing Time:{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedOption.processingTime}
                </span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Accuracy:{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedOption.accuracy}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Options */}
      <motion.div variants={itemVariants}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Advanced Options</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
          >
            {/* Analysis Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Analysis Depth
              </label>
              <select
                value={analysisDepth}
                onChange={(e) => setAnalysisDepth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="deep">Deep</option>
              </select>
            </div>

            {/* Include Metadata */}
            <div className="flex items-center space-x-2">
              <input
                id="include-metadata"
                type="checkbox"
                checked={includeMetadata}
                onChange={() => setIncludeMetadata(!includeMetadata)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label
                htmlFor="include-metadata"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Include Metadata
              </label>
            </div>

            {/* Confidence Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confidence Threshold ({confidenceThreshold}%)
              </label>
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={confidenceThreshold}
                onChange={(e) =>
                  setConfidenceThreshold(Number(e.target.value))
                }
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default AnalysisOptions
