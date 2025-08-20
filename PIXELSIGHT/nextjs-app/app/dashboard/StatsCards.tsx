'use client'
import { motion } from 'framer-motion'
import { ImageIcon, Target, Zap, Star, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export default function StatsCards() {
  const stats = [
    {
      title: 'Total Analyses',
      value: '2,543',
      change: '+12%',
      icon: <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Avg. Confidence',
      value: '94.7%',
      change: '+2.1%',
      icon: <Target className="w-6 h-6 text-green-600 dark:text-green-400" />,
      color: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Processing Speed',
      value: '2.3s',
      change: '-12%',
      icon: <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      color: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      title: 'Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      icon: <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
