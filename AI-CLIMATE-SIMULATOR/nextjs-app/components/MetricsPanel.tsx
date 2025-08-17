'use client'

import { Users, Thermometer, AlertTriangle, Droplets, Snowflake, Leaf, Zap, LucideIcon } from 'lucide-react'
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

interface MetricItemProps {
  icon: LucideIcon
  label: string
  value: string | number
  color: string
  unit?: string
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

  const MetricItem = ({ icon: Icon, label, value, color, unit = '' }: MetricItemProps) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
          <Icon size={18} className={color} />
        </div>
        <span className="text-sm font-medium text-gray-300">{label}:</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>
        {value}{unit}
      </span>
    </motion.div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="metrics-panel backdrop-blur-sm bg-gray-900/70 rounded-xl p-6 max-w-md border border-gray-800 shadow-glow"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
        <AlertTriangle size={24} className="text-warning-orange animate-pulse-slow" />
        Earth Metrics Dashboard
      </h2>
      
      <div className="space-y-3">
        <MetricItem 
          icon={Zap}
          label="CO₂ Level"
          value={metrics.co2Level.toFixed(0)}
          unit=" ppm"
          color={getHealthColor(metrics.co2Level, 2000, true)}
        />

        <MetricItem 
          icon={AlertTriangle}
          label="Air Toxicity"
          value={metrics.toxicityLevel.toFixed(1)}
          unit="%"
          color={getHealthColor(metrics.toxicityLevel, 100)}
        />

        <MetricItem 
          icon={Thermometer}
          label="Temperature"
          value={metrics.temperature.toFixed(1)}
          unit="°C"
          color={getHealthColor(metrics.temperature, 50)}
        />

        <div className="grid grid-cols-2 gap-3">
          <MetricItem 
            icon={Users}
            label="Humans"
            value={formatNumber(metrics.humanPopulation)}
            color="text-blue-400"
          />

          <MetricItem 
            icon={Leaf}
            label="Animals"
            value={formatNumber(metrics.animalPopulation)}
            color="text-green-400"
          />
        </div>

        <MetricItem 
          icon={Droplets}
          label="Ocean pH"
          value={metrics.oceanAcidity.toFixed(2)}
          color={getHealthColor(metrics.oceanAcidity, 9.0, true)}
        />

        <MetricItem 
          icon={Snowflake}
          label="Ice Melting"
          value={metrics.iceCapMelting.toFixed(1)}
          unit="%"
          color={getHealthColor(metrics.iceCapMelting, 100)}
        />

        <motion.div 
          className="mt-6 pt-4 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${getHealthColor(pollutionLevel, 100)}`}
              initial={{ width: '0%' }}
              animate={{ width: `${pollutionLevel}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-400">Overall Pollution</span>
            <span className={`text-sm font-bold ${getHealthColor(pollutionLevel, 100)}`}>
              {pollutionLevel.toFixed(1)}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}