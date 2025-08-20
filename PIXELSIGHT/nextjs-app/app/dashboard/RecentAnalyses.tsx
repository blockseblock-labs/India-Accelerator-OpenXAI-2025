'use client'
import { motion } from 'framer-motion'
import { Eye, Download, Camera } from 'lucide-react'
import { AnalysisResult } from '../lib/types'

interface RecentAnalysesProps {
  analyses: AnalysisResult[]
}

export default function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  if (analyses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Analyses
          </h3>
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No analyses yet</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Your First Analysis
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Analyses
        </h3>
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <motion.div
              key={analysis.id}
              whileHover={{ x: 4 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <img
                src={analysis.imageUrl}
                alt="Analysis thumbnail"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {analysis.analysisType} Analysis
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analysis.confidence}% confidence • {analysis.processingTime}ms
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {analysis.timestamp.toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
