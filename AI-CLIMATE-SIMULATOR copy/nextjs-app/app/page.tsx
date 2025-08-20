'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Send, RotateCcw, Play, Pause, Brain, Loader2 } from 'lucide-react'

// Dynamically import 3D components
const Globe = dynamic(() => import('../components/Globe'), { ssr: false })
const MetricsPanel = dynamic(() => import('../components/MetricsPanel'), { ssr: false })

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

interface AICommand {
  command: string
  analysis: string
  timestamp: Date
  responseTime: number
  model: string
}

const exampleCommands = [
  "Add 1 million V8 trucks to the world",
  "Build 1000 coal power plants",
  "Cut down the Amazon rainforest",
  "Smash a meteor into Earth",
  "Start a nuclear war",
]

const availableModels = [
  { id: 'llama3.2:1b', name: 'Llama 3.2 (1B)', description: 'Fast, minimal reasoning', disabled: false },
  { id: 'deepseek-r1:8b', name: 'DeepSeek R1 (8B)', description: 'Slow & accurate', disabled: true },
]

export default function Home() {
  const [metrics, setMetrics] = useState<EarthMetrics>({
    co2Level: 415,
    toxicityLevel: 5,
    temperature: 30,
    humanPopulation: 9000000000,
    animalPopulation: 100000000000,
    plantPopulation: 1000000000000,
    oceanAcidity: 8.1,
    iceCapMelting: 10,
  })

  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [pollutionLevel, setPollutionLevel] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [commandHistory, setCommandHistory] = useState<AICommand[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('')
  const [aiThinkingLog, setAiThinkingLog] = useState<string[]>([])
  const [specialEvent, setSpecialEvent] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState('llama3.2:1b')
  const inputRef = useRef<HTMLInputElement>(null)

  const thinkingSteps = [
    "Analyzing environmental impact...",
    "Calculating CO2 emissions...",
    "Estimating population effects...",
    "Computing temperature changes...",
    "Assessing ocean acidification...",
    "Evaluating biodiversity loss...",
    "Projecting climate consequences...",
    "Finalizing impact assessment..."
  ]

  const processUserCommand = async (command: string) => {
    setIsProcessing(true)
    setAiThinkingLog([])
    setCurrentAnalysis('')
    const startTime = Date.now()

    // Fake thinking process
    for (let step of thinkingSteps) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setAiThinkingLog(prev => [...prev, step])
    }

    try {
      const response = await fetch('/api/process-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, currentMetrics: metrics, pollutionLevel, model: 'llama3.2:1b' }),
      })

      if (!response.ok) throw new Error('Failed to process command')
      const data = await response.json()

      const endTime = Date.now()
      const responseTime = (endTime - startTime) / 1000

      setMetrics(data.metrics)
      setPollutionLevel(data.pollutionLevel)
      setCurrentAnalysis(data.analysis)
      setSpecialEvent(data.specialEvent)

      const newCommand: AICommand = {
        command,
        analysis: data.analysis,
        timestamp: new Date(),
        responseTime,
        model: 'llama3.2:1b',
      }
      setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)])
    } catch (err) {
      setCurrentAnalysis('Error: Failed to process command.')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isProcessing && userInput.trim()) processUserCommand(userInput.trim())
  }

  const handleExampleClick = (example: string) => {
    if (isProcessing) return
    setUserInput(example)
    setTimeout(() => processUserCommand(example), 100)
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
  }

  useEffect(() => {
    if (!isSimulationRunning || isProcessing) return
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        co2Level: Math.min(prev.co2Level + 0.1, 2000),
        toxicityLevel: Math.min(prev.toxicityLevel + 0.05, 100),
        temperature: Math.min(prev.temperature + 0.01, 50),
        humanPopulation: Math.max(prev.humanPopulation - 100, 0),
        animalPopulation: Math.max(prev.animalPopulation - 500, 0),
        plantPopulation: Math.max(prev.plantPopulation - 5000, 0),
        oceanAcidity: Math.max(prev.oceanAcidity - 0.001, 6.0),
        iceCapMelting: Math.min(prev.iceCapMelting + 0.05, 100),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [isSimulationRunning, isProcessing])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-lg border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          🌍 AI Earth Simulator
        </h1>
        <button
          onClick={resetEarth}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition"
        >
          <RotateCcw className="inline w-4 h-4 mr-1" /> Reset Earth
        </button>
      </header>

      {/* Dashboard */}
      <main className="flex-1 p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Globe */}
        <div className="col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-700">
          <Globe pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />
        </div>

        {/* Control Panel */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-blue-400" /> AI Controller
          </h2>

          {/* Simulation Controls */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'}
            </button>
          </div>

          {/* Command Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a command..."
              className="flex-1 px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isProcessing || !userInput.trim()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition flex items-center gap-2"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send
            </button>
          </form>

          {/* Example Commands */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 mb-2">Quick Actions:</h3>
            <div className="flex flex-wrap gap-2">
              {exampleCommands.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(ex)}
                  className="px-3 py-1 rounded-lg text-xs bg-gray-800 hover:bg-gray-700 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          {currentAnalysis && (
            <div className="bg-black/40 rounded-xl p-3 text-sm text-gray-300 border border-gray-700">
              <h4 className="font-semibold text-blue-400 mb-2">Impact Analysis</h4>
              <p className="whitespace-pre-line">{currentAnalysis}</p>
            </div>
          )}
        </div>

        {/* Metrics Panel */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-700">
          <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} />
        </div>

        {/* Command History */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-700 col-span-2">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Recent AI Requests:</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {commandHistory.map((cmd, i) => (
              <div key={i} className="text-xs border-l-2 border-blue-500 pl-2">
                <div className="text-gray-400 mb-1">
                  <span className="font-semibold">{cmd.model}</span> • {cmd.responseTime.toFixed(1)}s
                </div>
                <div className="text-gray-300 mb-1">{cmd.command}</div>
                <div className="text-gray-500 text-xs">{cmd.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
            {commandHistory.length === 0 && (
              <div className="text-gray-500 text-xs">No commands yet</div>
            )}
          </div>
        </div>

        {/* Model Selection */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">AI Model</h3>
          <select
            value={selectedModel}
            onChange={() => setSelectedModel('llama3.2:1b')}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
          >
            {availableModels.map(m => (
              <option key={m.id} value={m.id} disabled={m.disabled}>
                {m.name} – {m.description}
              </option>
            ))}
          </select>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-black/40 border-t border-gray-800 text-center text-sm text-gray-400">
        © 2025 Internship Project | Built with Next.js + Tailwind
      </footer>
    </div>
  )
}