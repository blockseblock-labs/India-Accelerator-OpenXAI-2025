'use client'

import { Users, Thermometer, AlertTriangle, Droplets, Snowflake, Leaf, Zap } from 'lucide-react'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'

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

  const getBadge = (value: number, max: number, reverse = false) => {
    const percentage = value / max
    const adjustedPercentage = reverse ? 1 - percentage : percentage
    
    if (adjustedPercentage < 0.3) return <span className="ml-2 px-2 py-0.5 rounded bg-green-600/20 text-green-400 text-xs">Safe</span>
    if (adjustedPercentage < 0.7) return <span className="ml-2 px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-400 text-xs">Warning</span>
    return <span className="ml-2 px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-xs">Critical</span>
  }

  const MetricRow = ({
    icon,
    label,
    value,
    suffix,
    max,
    reverse = false,
    isCountUp = false
  }: {
    icon: React.ReactNode
    label: string
    value: number
    suffix?: string
    max: number
    reverse?: boolean
    isCountUp?: boolean
  }) => {
    const percentage = Math.min((value / max) * 100, 100)

    return (
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-gray-300">{label}</span>
          </div>
          <div className="flex items-center">
            <span className={`text-sm font-semibold ${getHealthColor(value, max, reverse)}`}>
              {isCountUp ? (
                <CountUp end={value} decimals={suffix?.includes('%') ? 1 : 0} duration={1.5} />
              ) : (
                formatNumber(value)
              )}
              {suffix}
            </span>
            {getBadge(value, max, reverse)}
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-700/50 rounded">
          <div
            className={`h-2 rounded transition-all duration-700 ${getHealthColor(value, max, reverse).replace('text-', 'bg-')}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <div className="rounded-2xl p-6 max-w-sm 
      bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/70 
      animate-gradient bg-[length:200%_200%] 
      backdrop-blur-lg shadow-2xl border border-gray-700">
      
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-red-400 animate-pulse drop-shadow-[0_0_6px_#ef4444]" />
        Earth Metrics Dashboard
      </h2>
      
      <div className="space-y-5">
        <MetricRow icon={<Zap size={16} className="text-yellow-400" />} label="CO₂ Level:" value={metrics.co2Level} suffix=" ppm" max={2000} reverse />
        <MetricRow icon={<AlertTriangle size={16} className="text-red-400 animate-pulse" />} label="Air Toxicity:" value={metrics.toxicityLevel} suffix="%" max={100} isCountUp />
        <MetricRow icon={<Thermometer size={16} className="text-orange-400" />} label="Temperature:" value={metrics.temperature} suffix="°C" max={50} isCountUp />
        <MetricRow icon={<Users size={16} className="text-blue-400" />} label="Humans:" value={metrics.humanPopulation} max={8e9} />
        <MetricRow icon={<Leaf size={16} className="text-green-400" />} label="Animals:" value={metrics.animalPopulation} max={1e9} />
        <MetricRow icon={<Leaf size={16} className="text-emerald-400" />} label="Plants:" value={metrics.plantPopulation} max={5e9} />
        <MetricRow icon={<Droplets size={16} className="text-blue-400" />} label="Ocean pH:" value={metrics.oceanAcidity} max={9.0} reverse isCountUp />
        <MetricRow icon={<Snowflake size={16} className="text-cyan-400" />} label="Ice Melting:" value={metrics.iceCapMelting} suffix="%" max={100} isCountUp />

        {/* Overall Pollution */}
        <motion.div
          className="space-y-1 pt-3 border-t border-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400 animate-pulse" />
              <span className="text-sm text-gray-300">Pollution:</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-semibold ${getHealthColor(pollutionLevel, 100)}`}>
                <CountUp end={pollutionLevel} decimals={1} duration={1.5} />%
              </span>
              {getBadge(pollutionLevel, 100)}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-700/50 rounded">
            <div
              className={`h-2 rounded transition-all duration-700 ${getHealthColor(pollutionLevel, 100).replace('text-', 'bg-')}`}
              style={{ width: `${Math.min((pollutionLevel / 100) * 100, 100)}%` }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
