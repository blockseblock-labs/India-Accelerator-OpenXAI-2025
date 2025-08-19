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

export default function MetricsPanel({ metrics, pollutionLevel, animate = false }: MetricsPanelProps & { animate?: boolean }) {
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

  // Animated transitions for metrics (simple, for sci-fi effect)
  // Could use framer-motion for more advanced, but keep it simple for now
  return (
    <div className="metrics-panel rounded-lg px-2 py-1 flex gap-8 text-cyan-200 font-mono text-lg items-end">
      {/* CO2 Levels */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">CO₂</span>
        <span className={`font-bold ${getHealthColor(metrics.co2Level, 2000, true)} transition-all duration-500`}>{metrics.co2Level.toFixed(0)}<span className="text-xs">ppm</span></span>
      </div>
      {/* Air Toxicity */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">TOX</span>
        <span className={`font-bold ${getHealthColor(metrics.toxicityLevel, 100)} transition-all duration-500`}>{metrics.toxicityLevel.toFixed(1)}<span className="text-xs">%</span></span>
      </div>
      {/* Temperature */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">TEMP</span>
        <span className={`font-bold ${getHealthColor(metrics.temperature, 50)} transition-all duration-500`}>{metrics.temperature.toFixed(1)}<span className="text-xs">°C</span></span>
      </div>
      {/* Human Population */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">HUMANS</span>
        <span className="font-bold text-cyan-200 transition-all duration-500">{formatNumber(metrics.humanPopulation)}</span>
      </div>
      {/* Animal Population */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">ANIMALS</span>
        <span className="font-bold text-cyan-200 transition-all duration-500">{formatNumber(metrics.animalPopulation)}</span>
      </div>
      {/* Plant Population */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">PLANTS</span>
        <span className="font-bold text-cyan-200 transition-all duration-500">{formatNumber(metrics.plantPopulation)}</span>
      </div>
      {/* Ocean Acidity */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">OCEAN pH</span>
        <span className={`font-bold ${getHealthColor(metrics.oceanAcidity, 9.0, true)} transition-all duration-500`}>{metrics.oceanAcidity.toFixed(2)}</span>
      </div>
      {/* Ice Cap Melting */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">ICE</span>
        <span className={`font-bold ${getHealthColor(metrics.iceCapMelting, 100)} transition-all duration-500`}>{metrics.iceCapMelting.toFixed(1)}<span className="text-xs">%</span></span>
      </div>
      {/* Overall Pollution */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-cyan-400 tracking-widest">POLLUTION</span>
        <span className={`font-bold ${getHealthColor(pollutionLevel, 100)} transition-all duration-500`}>{pollutionLevel.toFixed(1)}<span className="text-xs">%</span></span>
      </div>
    </div>
  )
} 