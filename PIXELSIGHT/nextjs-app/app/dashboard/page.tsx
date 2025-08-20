'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Image, 
  Clock, 
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Users,
  Target,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatsCards from '../dashboard/StatsCards'
import RecentAnalyses from '../dashboard/RecentAnalyses'
import UsageChart from '../dashboard/UsageChart'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your AI analyses today.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
          <Button
            variant="primary"
            icon={<Image className="w-4 h-4" />}
            className="shadow-lg"
          >
            New Analysis
          </Button>
          <Button
            variant="secondary"
            icon={<Activity className="w-4 h-4" />}
          >
            View Reports
          </Button>
          <Button
            variant="ghost"
            icon={<Target className="w-4 h-4" />}
          >
            Analytics
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <StatsCards />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Usage Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Usage Analytics
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analysis activity over time
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {['24h', '7d', '30d', '90d'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          timeRange === range
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UsageChart timeRange={timeRange} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Speed</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">2.3s</div>
                    <div className="flex items-center text-xs text-green-600">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      12% faster
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">94.7%</div>
                    <div className="flex items-center text-xs text-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      2.1% better
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">4.8/5</div>
                    <div className="flex items-center text-xs text-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      0.2 increase
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Status
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                    <span className="flex items-center text-sm text-green-600">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="text-sm text-gray-900 dark:text-white">124ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="text-sm text-gray-900 dark:text-white">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Analyses */}
        <motion.div variants={itemVariants} className="mt-8">
          <RecentAnalyses analyses={[]} />
        </motion.div>
      </motion.div>
    </div>
  )
}
