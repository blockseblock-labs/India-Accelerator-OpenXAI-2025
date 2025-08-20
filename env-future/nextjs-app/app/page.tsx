'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Send, Loader2 } from 'lucide-react'

// Dynamically import the 3D components to avoid SSR issues
const Globe = dynamic(() => import('../components/Globe'), { ssr: false })
const MetricsPanel = dynamic(() => import('../components/MetricsPanel'), { ssr: false })

const defaultPrompt = (dailyUsage: number, budget: number, unitBill: number) =>
  `My home uses ${dailyUsage}kWh per day. My budget is ₹${budget}. My electricity bill per unit is ₹${unitBill}. 
Suggest:
- How many solar panels are required?
- Battery capacity and quantity.
- Is inverter required?
- How much CO₂ can I save?
- Full installation flow chart.
- In how many days will I recover my investment?
- Show all calculations and recommendations.`

export default function Home() {
  const [metrics, setMetrics] = useState({
    co2Level: 415,
    toxicityLevel: 5,
    temperature: 30,
    humanPopulation: 9000000000,
    animalPopulation: 100000000000,
    plantPopulation: 1000000000000,
    oceanAcidity: 8.1,
    iceCapMelting: 10,
  })

  const [pollutionLevel, setPollutionLevel] = useState(0)
  const [dailyUsage, setDailyUsage] = useState(10)
  const [budget, setBudget] = useState(200000)
  const [unitBill, setUnitBill] = useState(8)
  const [userInput, setUserInput] = useState(defaultPrompt(10, 200000, 8))
  const [isProcessing, setIsProcessing] = useState(false)
  const [commandHistory, setCommandHistory] = useState<any[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState('')
  const [aiThinkingLog, setAiThinkingLog] = useState<string[]>([])
  const [specialEvent, setSpecialEvent] = useState<string | null>(null)
  const [components, setComponents] = useState<any[]>([])
  const [paybackDays, setPaybackDays] = useState<number | null>(null)
  const [flowChart, setFlowChart] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const thinkingSteps = [
    "Analyzing your home energy needs...",
    "Calculating solar panel requirements...",
    "Estimating battery & inverter size...",
    "Calculating CO₂ savings...",
    "Calculating payback period...",
    "Preparing installation flow chart...",
    "Finalizing your solar solution..."
  ]

  useEffect(() => {
    setUserInput(defaultPrompt(dailyUsage, budget, unitBill))
  }, [dailyUsage, budget, unitBill])

  const processUserCommand = async (command: string) => {
    setIsProcessing(true)
    setAiThinkingLog([])
    setCurrentAnalysis('')
    setComponents([])
    setPaybackDays(null)
    setFlowChart([])

    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 180))
      setAiThinkingLog(prev => [...prev, thinkingSteps[i]])
    }

    try {
      const response = await fetch('/api/process-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          currentMetrics: metrics,
          pollutionLevel,
          dailyUsage,
          budget,
          unitBill,
        }),
      })
      if (!response.ok) throw new Error('Failed to process command')
      const data = await response.json()
      setMetrics(data.metrics)
      setPollutionLevel(data.pollutionLevel)
      setCurrentAnalysis(data.analysis)
      setSpecialEvent(data.specialEvent)
      setComponents(data.components || [])
      setPaybackDays(data.paybackDays || null)
      setFlowChart(data.flowChart || [])
      setCommandHistory(prev => [
        { command, analysis: data.analysis, timestamp: new Date() },
        ...prev.slice(0, 9)
      ])
    } catch (error) {
      setCurrentAnalysis('❌ Error: Failed to process command. Please try again.')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isProcessing && userInput.trim()) processUserCommand(userInput.trim())
  }

  const resetEarth = () => {
    setMetrics({
      co2Level: 415,
      toxicityLevel: 5,
      temperature: 30,
      humanPopulation: 9000000000,
      animalPopulation: 100000000000,
      plantPopulation: 1000000000000,
      oceanAcidity: 8.1,
      iceCapMelting: 10,
    })
    setPollutionLevel(0)
    setCommandHistory([])
    setCurrentAnalysis('')
    setSpecialEvent(null)
    setAiThinkingLog([])
    setIsProcessing(false)
    setComponents([])
    setUserInput(defaultPrompt(10, 200000, 8))
    setBudget(200000)
    setDailyUsage(10)
    setUnitBill(8)
    setPaybackDays(null)
    setFlowChart([])
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  return (
    <div className="globe-container">
      {/* 3D Globe */}
      <Globe pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <div className="metrics-panel rounded-lg p-4 mb-4 max-w-sm bg-gray-900 text-white">
          <h2 className="text-xl font-bold mb-2">🌱 Solar Solution & Payback</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <label className="block mb-2">Daily Usage (kWh)</label>
            <input ref={inputRef} value={dailyUsage} onChange={e => setDailyUsage(+e.target.value)} className="w-full mb-2 p-2 rounded bg-gray-700" type="number" />
            <label className="block mb-2">Budget (₹)</label>
            <input value={budget} onChange={e => setBudget(+e.target.value)} className="w-full mb-2 p-2 rounded bg-gray-700" type="number" />
            <label className="block mb-2">Per Unit Bill (₹)</label>
            <input value={unitBill} onChange={e => setUnitBill(+e.target.value)} className="w-full mb-2 p-2 rounded bg-gray-700" type="number" />
            <button disabled={isProcessing} className="w-full py-2 bg-blue-600 mt-2 rounded flex justify-center items-center gap-2">
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {isProcessing ? "Processing..." : "Get Solution"}
            </button>
          </form>
        </div>
      </div>

      {/* Metrics + Results Panel */}
      <div className="absolute top-4 right-4 z-20 max-w-md">
        <MetricsPanel
          metrics={metrics}
          analysis={currentAnalysis}
          components={components}
          paybackDays={paybackDays}
          flowChart={flowChart}
          aiThinkingLog={aiThinkingLog || []} // always pass array, never undefined
        />
      </div>

      {/* Reset Button */}
      <div className="absolute bottom-4 left-4 z-20">
        <button onClick={resetEarth} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold">
          Reset All
        </button>
      </div>
    </div>
  )
}
