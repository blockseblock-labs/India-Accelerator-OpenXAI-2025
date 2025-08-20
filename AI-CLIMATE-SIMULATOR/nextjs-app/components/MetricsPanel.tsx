'use client'

import { 
  Users, Thermometer, AlertTriangle, Droplets, Snowflake, 
  Leaf, Zap, TrendingUp, TrendingDown, Activity, Globe,
  Heart, Skull, TreePine, Fish
} from 'lucide-react'
import { useState } from 'react'

interface EarthMetrics {
  co2Level: number
  toxicityLevel: number
  temperature: number
  humanPopulation: number
  animalPopulation: number
  plantPopulation: number
  oceanAcidity: number
  iceCapMelting: number
}

interface MetricsPanelProps {
  metrics: EarthMetrics
  pollutionLevel: number
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  status: 'healthy' | 'warning' | 'critical'
  trend?: 'up' | 'down' | 'stable'
  subtitle?: string
}

function MetricCard({ icon, label, value, status, trend, subtitle }: MetricCardProps) {
  const statusColors = {
    healthy: 'border-green-500/30 bg-green-500/10 text-green-400',
    warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    critical: 'border-red-500/30 bg-red-500/10 text-red-400'
  }

  const trendIcons = {
    up: <TrendingUp size={12} className="text-red-400" />,
    down: <TrendingDown size={12} className="text-green-400" />,
    stable: <Activity size={12} className="text-blue-400" />
  }

  return (
    <div className={`metric-card border ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/5">
            {icon}
          </div>
          <div>
            <span className="text-sm font-medium text-white/90">{label}</span>
            {subtitle && <div className="text-xs text-white/50">{subtitle}</div>}
          </div>
        </div>
        {trend && trendIcons[trend]}
      </div>
      
      <div className="flex items-end justify-between">
        <span className={`text-lg font-bold ${statusColors[status].split(' ')[2]}`}>
          {value}
        </span>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
    </div>
  )
}

export default function MetricsPanel({ metrics, pollutionLevel }: MetricsPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview')

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(0)
  }

  const getMetricStatus = (value: number, thresholds: { good: number, warning: number }, inverted = false) => {
    if (inverted) {
      if (value >= thresholds.good) return 'healthy'
      if (value >= thresholds.warning) return 'warning'
      return 'critical'
    } else {
      if (value <= thresholds.good) return 'healthy'
      if (value <= thresholds.warning) return 'warning'
      return 'critical'
    }
  }

  const getTrend = (current: number, baseline: number) => {
    const change = ((current - baseline) / baseline) * 100
    if (Math.abs(change) < 2) return 'stable'
    return change > 0 ? 'up' : 'down'
  }

  // Calculate overall health score
  const healthScore = () => {
    const scores = [
      getMetricStatus(metrics.co2Level, { good: 450, warning: 800 }) === 'healthy' ? 100 : 
      getMetricStatus(metrics.co2Level, { good: 450, warning: 800 }) === 'warning' ? 50 : 0,
      
      getMetricStatus(metrics.toxicityLevel, { good: 20, warning: 60 }) === 'healthy' ? 100 :
      getMetricStatus(metrics.toxicityLevel, { good: 20, warning: 60 }) === 'warning' ? 50 : 0,
      
      getMetricStatus(metrics.temperature, { good: 32, warning: 40 }) === 'healthy' ? 100 :
      getMetricStatus(metrics.temperature, { good: 32, warning: 40 }) === 'warning' ? 50 : 0,
      
      getMetricStatus(metrics.oceanAcidity, { good: 8.0, warning: 7.5 }, true) === 'healthy' ? 100 :
      getMetricStatus(metrics.oceanAcidity, { good: 8.0, warning: 7.5 }, true) === 'warning' ? 50 : 0,
      
      getMetricStatus(metrics.iceCapMelting, { good: 20, warning: 50 }) === 'healthy' ? 100 :
      getMetricStatus(metrics.iceCapMelting, { good: 20, warning: 50 }) === 'warning' ? 50 : 0,
    ]
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const overallStatus = () => {
    const score = healthScore()
    if (score >= 70) return 'healthy'
    if (score >= 40) return 'warning'
    return 'critical'
  }

  const sections = [
    {
      id: 'overview',
      title: 'Planet Overview',
      icon: <Globe size={16} />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className={`mx-auto w-20 h-20 rounded-full border-4 flex items-center justify-center mb-3
              ${overallStatus() === 'healthy' ? 'border-green-500 bg-green-500/20' :
                overallStatus() === 'warning' ? 'border-yellow-500 bg-yellow-500/20' :
                'border-red-500 bg-red-500/20'}`}>
              <span className={`text-2xl font-bold
                ${overallStatus() === 'healthy' ? 'text-green-400' :
                  overallStatus() === 'warning' ? 'text-yellow-400' :
                  'text-red-400'}`}>
                {healthScore()}%
              </span>
            </div>
            <div className="text-sm text-white/60">Overall Planet Health</div>
          </div>
          
          <MetricCard
            icon={<AlertTriangle size={16} className="text-red-400" />}
            label="Global Pollution"
            value={`${pollutionLevel.toFixed(1)}%`}
            status={getMetricStatus(pollutionLevel, { good: 20, warning: 50 })}
            trend={getTrend(pollutionLevel, 5)}
            subtitle="Environmental contamination"
          />
        </div>
      )
    },
    {
      id: 'atmosphere',
      title: 'Atmosphere',
      icon: <Zap size={16} />,
      content: (
        <div className="space-y-3">
          <MetricCard
            icon={<Zap size={16} className="text-yellow-400" />}
            label="CO₂ Level"
            value={`${metrics.co2Level.toFixed(0)} ppm`}
            status={getMetricStatus(metrics.co2Level, { good: 450, warning: 800 })}
            trend={getTrend(metrics.co2Level, 415)}
            subtitle="Carbon dioxide concentration"
          />
          
          <MetricCard
            icon={<Skull size={16} className="text-red-400" />}
            label="Air Toxicity"
            value={`${metrics.toxicityLevel.toFixed(1)}%`}
            status={getMetricStatus(metrics.toxicityLevel, { good: 20, warning: 60 })}
            trend={getTrend(metrics.toxicityLevel, 5)}
            subtitle="Harmful pollutants"
          />
          
          <MetricCard
            icon={<Thermometer size={16} className="text-orange-400" />}
            label="Temperature"
            value={`${metrics.temperature.toFixed(1)}°C`}
            status={getMetricStatus(metrics.temperature, { good: 32, warning: 40 })}
            trend={getTrend(metrics.temperature, 30)}
            subtitle="Global average"
          />
        </div>
      )
    },
    {
      id: 'life',
      title: 'Life Forms',
      icon: <Heart size={16} />,
      content: (
        <div className="space-y-3">
          <MetricCard
            icon={<Users size={16} className="text-blue-400" />}
            label="Humans"
            value={formatNumber(metrics.humanPopulation)}
            status={getMetricStatus(metrics.humanPopulation, { good: 8000000000, warning: 5000000000 }, true)}
            trend={getTrend(metrics.humanPopulation, 9000000000)}
            subtitle="Global population"
          />
          
          <MetricCard
            icon={<Heart size={16} className="text-pink-400" />}
            label="Animals"
            value={formatNumber(metrics.animalPopulation)}
            status={getMetricStatus(metrics.animalPopulation, { good: 80000000000, warning: 50000000000 }, true)}
            trend={getTrend(metrics.animalPopulation, 100000000000)}
            subtitle="Wildlife count"
          />
          
          <MetricCard
            icon={<TreePine size={16} className="text-green-400" />}
            label="Plants"
            value={formatNumber(metrics.plantPopulation)}
            status={getMetricStatus(metrics.plantPopulation, { good: 800000000000, warning: 500000000000 }, true)}
            trend={getTrend(metrics.plantPopulation, 1000000000000)}
            subtitle="Flora biomass"
          />
        </div>
      )
    },
    {
      id: 'environment',
      title: 'Environment',
      icon: <Droplets size={16} />,
      content: (
        <div className="space-y-3">
          <MetricCard
            icon={<Fish size={16} className="text-blue-400" />}
            label="Ocean pH"
            value={metrics.oceanAcidity.toFixed(2)}
            status={getMetricStatus(metrics.oceanAcidity, { good: 8.0, warning: 7.5 }, true)}
            trend={getTrend(metrics.oceanAcidity, 8.1)}
            subtitle="Acidity level"
          />
          
          <MetricCard
            icon={<Snowflake size={16} className="text-cyan-400" />}
            label="Ice Melting"
            value={`${metrics.iceCapMelting.toFixed(1)}%`}
            status={getMetricStatus(metrics.iceCapMelting, { good: 20, warning: 50 })}
            trend={getTrend(metrics.iceCapMelting, 10)}
            subtitle="Polar ice loss"
          />
        </div>
      )
    }
  ]

  return (
    <div className="glass-panel max-w-sm max-h-[calc(100vh-200px)] overflow-hidden float-animation">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Earth Metrics</h2>
            <p className="text-xs text-white/60">Real-time planetary status</p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-white/5 last:border-b-0">
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-1 rounded bg-white/10">
                  {section.icon}
                </div>
                <span className="font-medium text-white/90">{section.title}</span>
              </div>
              <div className={`transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {expandedSection === section.id && (
              <div className="px-4 pb-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">Last updated: {new Date().toLocaleTimeString()}</div>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${overallStatus() === 'healthy' ? 'bg-green-500/20 text-green-400' :
              overallStatus() === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'}`}>
            <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
            System {overallStatus() === 'healthy' ? 'Stable' : overallStatus() === 'warning' ? 'Unstable' : 'Critical'}
          </div>
        </div>
      </div>
    </div>
  )
}