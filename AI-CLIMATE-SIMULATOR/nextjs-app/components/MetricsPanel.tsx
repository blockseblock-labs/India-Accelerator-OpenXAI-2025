'use client'

import { Users, Thermometer, AlertTriangle, Droplets, Snowflake, Leaf, Zap } from 'lucide-react'

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

export default function MetricsPanel({ metrics, pollutionLevel }: MetricsPanelProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(0)
  }

  const getHealthColor = (value: number, max: number, reverse = false) => {
    const percentage = value / max
    const adjustedPercentage = reverse ? 1 - percentage : percentage
    
    if (adjustedPercentage < 0.3) return 'text-green-400'
    if (adjustedPercentage < 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="metrics-panel rounded-lg p-4 max-w-sm">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-red-400" />
        Earth Metrics
      </h2>
      
      <div className="space-y-3">
        {/* CO2 Levels */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm text-gray-300">CO₂ Level:</span>
          </div>
          <span className={`text-sm font-semibold ${getHealthColor(metrics.co2Level, 2000, true)}`}>
            {metrics.co2Level.toFixed(0)} ppm
          </span>
        </div>

        {/* Air Toxicity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-sm text-gray-300">Air Toxicity:</span>
          </div>
          <span className={`text-sm font-semibold ${getHealthColor(metrics.toxicityLevel, 100)}`}>
            {metrics.toxicityLevel.toFixed(1)}%
          </span>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-orange-400" />
            <span className="text-sm text-gray-300">Temperature:</span>
          </div>
          <span className={`text-sm font-semibold ${getHealthColor(metrics.temperature, 50)}`}>
            {metrics.temperature.toFixed(1)}°C
          </span>
        </div>

        {/* Human Population */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">Humans:</span>
          </div>
          <span className="text-sm font-semibold text-gray-300">
            {formatNumber(metrics.humanPopulation)}
          </span>
        </div>

        {/* Animal Population */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-green-400" />
            <span className="text-sm text-gray-300">Animals:</span>
          </div>
          <span className="text-sm font-semibold text-gray-300">
            {formatNumber(metrics.animalPopulation)}
          </span>
        </div>

        {/* Plant Population */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-emerald-400" />
            <span className="text-sm text-gray-300">Plants:</span>
          </div>
          <span className="text-sm font-semibold text-gray-300">
            {formatNumber(metrics.plantPopulation)}
          </span>
        </div>

        {/* Ocean Acidity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">Ocean pH:</span>
          </div>
          <span className={`text-sm font-semibold ${getHealthColor(metrics.oceanAcidity, 9.0, true)}`}>
            {metrics.oceanAcidity.toFixed(2)}
          </span>
        </div>

        {/* Ice Cap Melting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-300">Ice Melting:</span>
          </div>
          <span className={`text-sm font-semibold ${getHealthColor(metrics.iceCapMelting, 100)}`}>
            {metrics.iceCapMelting.toFixed(1)}%
          </span>
        </div>

        {/* Overall Pollution */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-600">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-sm text-gray-300">Pollution:</span>
          </div>
          <span className={`text-sm font-semibold ${getHealthColor(pollutionLevel, 100)}`}>
            {pollutionLevel.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
} 