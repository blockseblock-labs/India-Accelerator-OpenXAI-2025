'use client'

import React, { useEffect, useState } from 'react'
import { Users, Thermometer, AlertTriangle, Droplets, Snowflake, Leaf, Zap } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

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
  const [history, setHistory] = useState({
    co2Level: [] as number[],
    toxicityLevel: [] as number[],
    temperature: [] as number[],
    humanPopulation: [] as number[],
    animalPopulation: [] as number[],
    plantPopulation: [] as number[],
    oceanAcidity: [] as number[],
    iceCapMelting: [] as number[],
    pollutionLevel: [] as number[],
  })

  useEffect(() => {
    setHistory(prev => ({
      co2Level: [...prev.co2Level.slice(-19), metrics.co2Level],
      toxicityLevel: [...prev.toxicityLevel.slice(-19), metrics.toxicityLevel],
      temperature: [...prev.temperature.slice(-19), metrics.temperature],
      humanPopulation: [...prev.humanPopulation.slice(-19), metrics.humanPopulation],
      animalPopulation: [...prev.animalPopulation.slice(-19), metrics.animalPopulation],
      plantPopulation: [...prev.plantPopulation.slice(-19), metrics.plantPopulation],
      oceanAcidity: [...prev.oceanAcidity.slice(-19), metrics.oceanAcidity],
      iceCapMelting: [...prev.iceCapMelting.slice(-19), metrics.iceCapMelting],
      pollutionLevel: [...prev.pollutionLevel.slice(-19), pollutionLevel],
    }))
  }, [metrics, pollutionLevel])

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

  const MetricRow = ({
    icon,
    label,
    value,
    max,
    reverse,
    formatter,
    historyData
  }: {
    icon: React.ReactNode
    label: string
    value: number
    max: number
    reverse?: boolean
    formatter?: (val: number) => string
    historyData: number[]
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${getHealthColor(value, max, reverse)}`}>
          {formatter ? formatter(value) : value.toFixed(1)}
        </span>
      </div>
      <div className="h-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData.map(v => ({ value: v }))}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={
                getHealthColor(value, max, reverse) === 'text-green-400'
                  ? '#4ade80' // green
                  : getHealthColor(value, max, reverse) === 'text-yellow-400'
                    ? '#facc15' // yellow
                    : '#f87171' // red
              }
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  return (
    <div className="metrics-panel rounded-lg p-4 w-full max-w-xl bg-gray-900 bg-opacity-80">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-red-400" />
        Earth Metrics
      </h2>

      <div className="space-y-4">
        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-red-400">
          <MetricRow icon={<Zap size={16} className="text-yellow-400" />} label="CO₂ Level:" value={metrics.co2Level} max={2000} reverse historyData={history.co2Level} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-red-400">
          <MetricRow icon={<AlertTriangle size={16} className="text-red-400" />} label="Air Toxicity:" value={metrics.toxicityLevel} max={100} historyData={history.toxicityLevel} formatter={v => `${v.toFixed(1)}%`} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-orange-400">
          <MetricRow icon={<Thermometer size={16} className="text-orange-400" />} label="Temperature:" value={metrics.temperature} max={50} historyData={history.temperature} formatter={v => `${v.toFixed(1)}°C`} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-blue-400">
          <MetricRow icon={<Users size={16} className="text-blue-400" />} label="Humans:" value={metrics.humanPopulation} max={8e9} historyData={history.humanPopulation} formatter={formatNumber} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-green-400">
          <MetricRow icon={<Leaf size={16} className="text-green-400" />} label="Animals:" value={metrics.animalPopulation} max={1e9} historyData={history.animalPopulation} formatter={formatNumber} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-emerald-400">
          <MetricRow icon={<Leaf size={16} className="text-emerald-400" />} label="Plants:" value={metrics.plantPopulation} max={1e12} historyData={history.plantPopulation} formatter={formatNumber} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-blue-400">
          <MetricRow icon={<Droplets size={16} className="text-blue-400" />} label="Ocean pH:" value={metrics.oceanAcidity} max={9.0} reverse historyData={history.oceanAcidity} formatter={v => v.toFixed(2)} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-cyan-400">
          <MetricRow icon={<Snowflake size={16} className="text-cyan-400" />} label="Ice Melting:" value={metrics.iceCapMelting} max={100} historyData={history.iceCapMelting} formatter={v => `${v.toFixed(1)}%`} />
        </div>

        <div className="transition-transform hover:scale-105 hover:animate-pulse hover:text-red-400">
          <MetricRow icon={<AlertTriangle size={16} className="text-red-400" />} label="Pollution:" value={pollutionLevel} max={100} historyData={history.pollutionLevel} formatter={v => `${v.toFixed(1)}%`} />
        </div>
      </div>
    </div>

  )
}
