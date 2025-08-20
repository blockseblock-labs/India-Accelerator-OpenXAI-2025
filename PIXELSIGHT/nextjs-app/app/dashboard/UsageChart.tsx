'use client'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { cn } from '../lib/utils'
interface UsageChartProps {
  timeRange: string
}

export default function UsageChart({ timeRange }: UsageChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Usage Analytics
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Chart Coming Soon</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Advanced analytics and reporting features are under development.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Selected Range: <span className="font-mono">{timeRange}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
