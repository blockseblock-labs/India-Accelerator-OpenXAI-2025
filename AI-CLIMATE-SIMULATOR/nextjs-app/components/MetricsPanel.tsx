'use client'

import { useState, useEffect } from 'react'
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
  const [activeIndex, setActiveIndex] = useState(0)

  // Move highlight every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 9) // 8 metrics + pollution
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(0)
  }

  const getHealthColor = (value: number, max: number, reverse = false) => {
    const percentage = value / max
    const adjusted = reverse ? 1 - percentage : percentage
    if (adjusted < 0.3) return 'green'
    if (adjusted < 0.7) return 'yellow'
    return 'red'
  }

  const metricsList = [
    { icon: <Zap size={16} className="text-yellow-400" />, label: 'CO₂ Level:', value: metrics.co2Level, suffix: ' ppm', max: 2000, reverse: true },
    { icon: <AlertTriangle size={16} className="text-red-400" />, label: 'Air Toxicity:', value: metrics.toxicityLevel, suffix: '%', max: 100 },
    { icon: <Thermometer size={16} className="text-orange-400" />, label: 'Temperature:', value: metrics.temperature, suffix: '°C', max: 50 },
    { icon: <Users size={16} className="text-blue-400" />, label: 'Humans:', value: metrics.humanPopulation, max: 8e9 },
    { icon: <Leaf size={16} className="text-green-400" />, label: 'Animals:', value: metrics.animalPopulation, max: 1e9 },
    { icon: <Leaf size={16} className="text-emerald-400" />, label: 'Plants:', value: metrics.plantPopulation, max: 5e9 },
    { icon: <Droplets size={16} className="text-blue-400" />, label: 'Ocean pH:', value: metrics.oceanAcidity, max: 9.0, reverse: true },
    { icon: <Snowflake size={16} className="text-cyan-400" />, label: 'Ice Melting:', value: metrics.iceCapMelting, suffix: '%', max: 100 },
    { icon: <AlertTriangle size={16} className="text-red-400" />, label: 'Pollution:', value: pollutionLevel, suffix: '%', max: 100 },
  ]

  return (
    <div className="rounded-2xl p-6 max-w-sm relative
      bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/70 
      backdrop-blur-lg shadow-2xl border border-gray-700">

      {/* Heading - stays static, no blinking */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-red-400 animate-pulse" />
        Earth Metrics Dashboard
      </h2>

      {/* Metrics container with highlight */}
      <div className="relative">
        {/* Highlight background layer (only inside metrics list) */}
        <motion.div
          className="absolute left-0 right-0 h-12 rounded-lg opacity-25"
          style={{
            top: `${activeIndex * 64}px`, // adjust: 64px = row height (h-12 + margin)
          }}
          animate={{
            backgroundColor:
              getHealthColor(metricsList[activeIndex].value, metricsList[activeIndex].max, metricsList[activeIndex].reverse) === 'green'
                ? '#22c55e'
                : getHealthColor(metricsList[activeIndex].value, metricsList[activeIndex].max, metricsList[activeIndex].reverse) === 'yellow'
                ? '#eab308'
                : '#ef4444',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        <div className="space-y-4 relative z-10">
          {metricsList.map((m, idx) => (
            <div key={idx} className="h-12 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {m.icon}
                  <span className="text-sm text-gray-300">{m.label}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-200">
                    <CountUp end={m.value} duration={1.5} />
                    {m.suffix}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-700/50 rounded mt-1">
                <div
                  className="h-2 rounded"
                  style={{
                    width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                    backgroundColor:
                      getHealthColor(m.value, m.max, m.reverse) === 'green'
                        ? '#22c55e'
                        : getHealthColor(m.value, m.max, m.reverse) === 'yellow'
                        ? '#eab308'
                        : '#ef4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
