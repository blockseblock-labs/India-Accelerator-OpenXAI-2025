'use client'

interface EarthStats {
  co2Level: number
  toxicityLevel: number
  temperature: number
  humanPopulation: number
  animalPopulation: number
  plantPopulation: number
  oceanAcidity: number
  iceCapMelting: number
}

interface StatsCardProps {
  stats?: EarthStats   // optional now
  pollutionLevel?: number
}

export default function StatsCard({ 
  stats = {
    co2Level: 415,
    toxicityLevel: 5,
    temperature: 30,
    humanPopulation: 9_000_000_000,
    animalPopulation: 100_000_000_000,
    plantPopulation: 1_000_000_000_000,
    oceanAcidity: 8.10,
    iceCapMelting: 10,
  }, 
  pollutionLevel = 0 
}: StatsCardProps) {
  
  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    return num.toFixed(0)
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl p-4 max-w-sm shadow-lg border border-gray-700">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        🌍 Earth – Player Stats
      </h2>

      <div className="space-y-3 text-sm font-medium">
        <div className="flex justify-between">
          <span>🔋 Energy Level</span>
          <span>{stats.co2Level.toFixed(0)} ppm (Danger Zone ⚠️)</span>
        </div>

        <div className="flex justify-between">
          <span>❤️ Health</span>
          <span>{stats.toxicityLevel.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between">
          <span>🔥 Heat</span>
          <span>{stats.temperature.toFixed(1)}°C (High Risk)</span>
        </div>

        <div className="flex justify-between">
          <span>🧑 Humans</span>
          <span>{formatNumber(stats.humanPopulation)} (Overloaded)</span>
        </div>

        <div className="flex justify-between">
          <span>🐾 Animals</span>
          <span>{formatNumber(stats.animalPopulation)} (Stable)</span>
        </div>

        <div className="flex justify-between">
          <span>🌿 Plants</span>
          <span>{formatNumber(stats.plantPopulation)} (Strong Defense)</span>
        </div>

        <div className="flex justify-between">
          <span>🌊 Ocean pH</span>
          <span>{stats.oceanAcidity.toFixed(2)} (Balanced, but fragile)</span>
        </div>

        <div className="flex justify-between">
          <span>❄️ Ice Shield</span>
          <span>-{stats.iceCapMelting.toFixed(1)}% (Weakening)</span>
        </div>

        <div className="flex justify-between border-t border-gray-700 pt-2">
          <span>☣️ Pollution</span>
          <span>{pollutionLevel.toFixed(1)}% (Safe for now)</span>
        </div>
      </div>
    </div>
  )
}
