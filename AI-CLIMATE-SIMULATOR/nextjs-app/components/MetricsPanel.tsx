'use client'

import { Users, Thermometer, AlertTriangle, Droplets, Snowflake, Leaf, Zap } from 'lucide-react'
import { ReactNode } from 'react'

interface MetricProps {
  icon: ReactNode
  label: string
  value: string | number
  color?: string
}

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

const Metric = ({ icon, label, value, color = 'text-gray-300' }: MetricProps) => (
  <div className="flex items-center justify-between p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg hover:bg-slate-800/70 transition-all duration-200">
    <div className="flex items-center gap-2">
      <div className="text-cyan-400">
        {icon}
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${color}`}>
      {value}
    </span>
  </div>
)

export default function MetricsPanel({ metrics, pollutionLevel }: MetricsPanelProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(0)
  }

  const getHealthColor = (value: number, max: number, reverse = false): string => {
    const percentage = value / max
    if (reverse) {
      if (percentage < 0.3) return 'text-red-400'
      if (percentage < 0.6) return 'text-yellow-400'
      return 'text-emerald-400'
    }
    if (percentage > 0.7) return 'text-red-400'
    if (percentage > 0.4) return 'text-yellow-400'
    return 'text-emerald-400'
  }

  return (
    <div className="metrics-panel rounded-xl p-6 max-w-sm bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
        <AlertTriangle size={20} className="text-red-400" />
        Earth Metrics
      </h2>

      <div className="space-y-3">
        <Metric
          icon={<Zap size={16} />}
          label="CO₂ Level"
          value={`${metrics.co2Level.toFixed(0)} ppm`}
          color={getHealthColor(metrics.co2Level, 2000, true)}
        />

        <Metric
          icon={<AlertTriangle size={16} />}
          label="Air Toxicity"
          value={`${metrics.toxicityLevel.toFixed(1)}%`}
          color={getHealthColor(metrics.toxicityLevel, 100)}
        />

        <Metric
          icon={<Thermometer size={16} />}
          label="Temperature"
          value={`${metrics.temperature.toFixed(1)}°C`}
          color={getHealthColor(metrics.temperature, 50)}
        />

        <Metric
          icon={<Users size={16} />}
          label="Humans"
          value={formatNumber(metrics.humanPopulation)}
        />

        <Metric
          icon={<Leaf size={16} />}
          label="Animals"
          value={formatNumber(metrics.animalPopulation)}
        />

        <Metric
          icon={<Leaf size={16} />}
          label="Plants"
          value={formatNumber(metrics.plantPopulation)}
        />

        <Metric
          icon={<Droplets size={16} />}
          label="Ocean pH"
          value={metrics.oceanAcidity.toFixed(2)}
          color={getHealthColor(metrics.oceanAcidity, 9.0, true)}
        />

        <Metric
          icon={<Snowflake size={16} />}
          label="Ice Melting"
          value={`${metrics.iceCapMelting.toFixed(1)}%`}
          color={getHealthColor(metrics.iceCapMelting, 100)}
        />

        <div className="border-t border-slate-700 mt-4 pt-4">
          <Metric
            icon={<AlertTriangle size={16} />}
            label="Overall Pollution"
            value={`${pollutionLevel.toFixed(1)}%`}
            color={getHealthColor(pollutionLevel, 100)}
          />
        </div>
      </div>
    </div>
  )
}