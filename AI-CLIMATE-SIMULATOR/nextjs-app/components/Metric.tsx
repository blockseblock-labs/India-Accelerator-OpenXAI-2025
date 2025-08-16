'use client'

import { ReactNode } from 'react'

interface MetricProps {
  icon: ReactNode
  label: string
  value: string | number
  color?: string
}

export default function Metric({ icon, label, value, color = 'text-gray-300' }: MetricProps) {
  return (
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
}
