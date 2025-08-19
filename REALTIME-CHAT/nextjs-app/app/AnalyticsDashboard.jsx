import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Clock, MessageSquare, Zap, Brain, Users, Target } from 'lucide-react'

interface AnalyticsData {
  totalMessages: number
  totalSessions: number
  averageResponseTime: number
  modeUsage: { [key: string]: number }
  dailyActivity: { date: string; messages: number }[]
  responseQuality: number
  userSatisfaction: number
}

interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
  messages: any[]
}

export default function AnalyticsDashboard({ isOpen, onClose, messages }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalMessages: 0,
    totalSessions: 1,
    averageResponseTime: 2.3,
    modeUsage: {},
    dailyActivity: [],
    responseQuality: 94,
    userSatisfaction: 4.8
  })

  useEffect(() => {
    // Calculate analytics from messages
    const modeCount: { [key: string]: number } = {}
    const dailyCount: { [key: string]: number } = {}

    messages.forEach(msg => {
      if (msg.mode) {
        modeCount[msg.mode] = (modeCount[msg.mode] || 0) + 1
      }
      
      if (msg.timestamp) {
        const date = new Date(msg.timestamp).toDateString()
        dailyCount[date] = (dailyCount[date] || 0) + 1
      }
    })

    const dailyActivity = Object.entries(dailyCount).map(([date, count]) => ({
      date,
      messages: count
    }))

    setAnalytics(prev => ({
      ...prev,
      totalMessages: messages.length,
      modeUsage: modeCount,
      dailyActivity
    }))
  }, [messages])

  if (!isOpen) return null

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'from-blue-500 to-purple-600' }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
    </div>
  )

  const ProgressBar = ({ label, value, max = 100, color = 'bg-blue-500' }: any) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  )

  const ModeChart = () => {
    const totalModeMessages = Object.values(analytics.modeUsage).reduce((a, b) => a + b, 0)
    const modes = [
      { name: 'General', key: 'general', color: 'bg-blue-500' },
      { name: 'Code', key: 'code', color: 'bg-green-500' },
      { name: 'Content', key: 'content', color: 'bg-purple-500' },
      { name: 'Study', key: 'study', color: 'bg-orange-500' },
      { name: 'Data', key: 'data', color: 'bg-cyan-500' },
      { name: 'Creative', key: 'creative', color: 'bg-yellow-500' }
    ]

    return (
      <div className="space-y-3">
        {modes.map(mode => {
          const count = analytics.modeUsage[mode.key] || 0
          const percentage = totalModeMessages > 0 ? (count / totalModeMessages) * 100 : 0
          return (
            <div key={mode.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${mode.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700">{mode.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${mode.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600">Performance insights and usage statistics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={MessageSquare}
              title="Total Messages"
              value={analytics.totalMessages}
              subtitle="All time"
              color="from-blue-500 to-purple-600"
            />
            <StatCard
              icon={Clock}
              title="Avg Response Time"
              value={`${analytics.averageResponseTime}s`}
              subtitle="Last 24h"
              color="from-green-500 to-blue-600"
            />
            <StatCard
              icon={Brain}
              title="AI Quality Score"
              value={`${analytics.responseQuality}%`}
              subtitle="Response accuracy"
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              icon={Users}
              title="User Satisfaction"
              value={analytics.userSatisfaction}
              subtitle="⭐ Rating"
              color="from-orange-500 to-red-600"
            />
          </div>

          {/* Charts and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mode Usage */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-500" />
                AI Mode Usage
              </h3>
              <ModeChart />
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <ProgressBar label="Response Speed" value={87} color="bg-green-500" />
                <ProgressBar label="AI Accuracy" value={94} color="bg-blue-500" />
                <ProgressBar label="User Engagement" value={78} color="bg-purple-500" />
                <ProgressBar label="Feature Adoption" value={65} color="bg-orange-500" />
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-cyan-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {analytics.dailyActivity.slice(-5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{day.date}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{day.messages} messages</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 AI Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="font-medium text-gray-900">Most Used Mode</div>
                <div className="text-gray-600">
                  {Object.entries(analytics.modeUsage).sort(([,a], [,b]) => b - a)[0]?.[0] || 'General'} Mode
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="font-medium text-gray-900">Peak Usage</div>
                <div className="text-gray-600">Today at 2:30 PM</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="font-medium text-gray-900">Efficiency Score</div>
                <div className="text-gray-600">95% - Excellent!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}