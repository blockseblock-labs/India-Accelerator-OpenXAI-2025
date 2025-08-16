interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  trend?: 'up' | 'down' | 'neutral'
  unit?: string
}

export default function MetricCard({ icon, label, value, trend, unit }: MetricCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 transition-all duration-300 hover:bg-slate-800/70">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-xl font-semibold mt-1">
              {value}
              {unit && <span className="text-slate-400 text-sm ml-1">{unit}</span>}
            </p>
          </div>
        </div>
        {trend && (
          <div className={`
            px-2 py-1 rounded text-sm font-medium
            ${trend === 'up' ? 'bg-red-500/20 text-red-400' : ''}
            ${trend === 'down' ? 'bg-green-500/20 text-green-400' : ''}
            ${trend === 'neutral' ? 'bg-slate-500/20 text-slate-400' : ''}
          `}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
    </div>
  )
}
