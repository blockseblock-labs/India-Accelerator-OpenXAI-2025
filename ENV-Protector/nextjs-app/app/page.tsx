'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Send, RotateCcw, Play, Pause, Brain, Loader2 } from 'lucide-react'

// Dynamically import the 3D components to avoid SSR issues
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
  "Crash the moon into Earth",
  "God saves the Earth",
  "Release 50 million tons of CO2",
  "Build 10,000 factories in China",
  "Erupt all volcanoes simultaneously",
  "Dump nuclear waste in the ocean",
  "Burn all fossil fuel reserves",
  "Destroy all coral reefs",
  "Release methane from permafrost",
  "Spray aerosols into the atmosphere",
  "Melt all polar ice caps",
  "Poison all freshwater sources"
]

const availableModels = [
  { id: 'llama3.2:1b', name: 'Llama 3.2 (1B)', description: 'Fast, minimal reasoning (default)', disabled: false },
  { id: 'deepseek-r1:8b', name: 'DeepSeek R1 (8B)', description: 'Slow & accurate', disabled: true },
  { id: 'qwen3:8b', name: 'Qwen3 (8B)', description: 'Fast inference', disabled: true },
  { id: 'deepseek-r1:1.5b', name: 'DeepSeek R1 (1.5B)', description: 'Fast inference', disabled: true }
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
  const [selectedModel, setSelectedModel] = useState('llama3:latest')
  const inputRef = useRef<HTMLInputElement>(null)

  // AI thinking steps
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

    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
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
          model: 'llama3:latest',
        }),
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
        model: 'llama3:latest'
      }
      setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error processing command:', error)
      setCurrentAnalysis('Error: Failed to process command. Please try again.')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isProcessing && userInput.trim()) {
      processUserCommand(userInput.trim())
    }
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
    setIsSimulationRunning(false)
    setCommandHistory([])
    setCurrentAnalysis('')
    setSpecialEvent(null)
    setAiThinkingLog([])
    setIsProcessing(false)
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

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="globe-container">
      <Globe pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />

      {/* AI Earth Controller */}
      <div className="absolute top-4 left-4 z-20">
        <div className="rounded-2xl p-6 mb-6 max-w-sm max-h-[80vh] overflow-y-auto
          bg-gray-900/50 backdrop-blur-md border border-cyan-400/50 
          shadow-[0_0_20px_rgba(0,255,255,0.6),0_0_40px_rgba(0,255,255,0.3)]
          hover:shadow-[0_0_30px_rgba(0,255,255,0.9)] transition-all duration-300">

          <h2 className="text-xl font-bold mb-4 text-cyan-300 drop-shadow-md">🌍 AI Earth Controller</h2>

          {/* Simulation Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                bg-gradient-to-r from-cyan-500 to-blue-600
                shadow-[inset_0_-2px_8px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,255,255,0.4)]
                border border-cyan-400/50 text-white tracking-wide
                hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]
                active:scale-95 transition-all duration-300"
            >
              {isSimulationRunning ? <Pause size={16}/> : <Play size={16}/>}
              {isSimulationRunning ? 'Pause' : 'Start'} Auto-Simulation
            </button>

            <button
              onClick={resetEarth}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                bg-gradient-to-r from-green-500 to-emerald-600
                shadow-[inset_0_-2px_8px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,255,0,0.4)]
                border border-green-400/50 text-white tracking-wide
                hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,100,0.7)]
                active:scale-95 transition-all duration-300"
            >
              <RotateCcw size={16}/> Reset Earth
            </button>
          </div>

          {/* Command Input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your environmental command..."
                disabled={isProcessing}
                className="flex-1 px-3 py-2 bg-gray-800/70 border border-cyan-400/30 rounded-lg text-white 
                  placeholder-gray-400 disabled:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="px-4 py-2 rounded-lg font-semibold
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  shadow-[inset_0_-2px_6px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,255,0.4)]
                  border border-blue-400/50 text-white tracking-wide flex items-center gap-2
                  hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,255,0.7)]
                  active:scale-95 transition-all duration-300
                  disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Send
              </button>
            </div>
          </form>

          {/* Example Commands */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Example Commands:</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {exampleCommands.slice(0, 5).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  disabled={isProcessing}
                  className="block w-full text-left px-2 py-1 text-xs
                    bg-gray-700/60 hover:bg-gray-600 rounded text-gray-300
                    disabled:bg-gray-800 disabled:text-gray-500 transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* AI Thinking Log */}
          {aiThinkingLog.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-cyan-300 flex items-center gap-2">
                <Brain size={14}/> AI Analysis:
              </h3>
              <div className="space-y-1">
                {aiThinkingLog.map((step, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Analysis */}
          {currentAnalysis && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-cyan-300">Impact Analysis:</h3>
              <div className="max-h-32 overflow-y-auto bg-gray-800/60 p-3 rounded-lg">
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentAnalysis}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="absolute top-4 right-4 z-20">
        <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} />
      </div>

      {/* Command History */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="rounded-lg p-4 max-w-md bg-gray-900/60 border border-cyan-400/30 shadow-md">
          <h3 className="text-sm font-semibold mb-2 text-cyan-200">Recent AI Requests:</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {commandHistory.map((cmd, index) => (
              <div key={index} className="text-xs border-l-2 border-blue-500 pl-2">
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
      </div>

      {/* Model Selection */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="rounded-lg p-4 border border-cyan-400/50 bg-gray-900/70 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          <h3 className="text-sm font-semibold mb-3 text-cyan-300 flex items-center gap-2">
            AI Model:
          </h3>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/80 border border-cyan-400/40 rounded text-cyan-100 text-sm 
              focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]
              hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id} disabled={model.disabled} className="bg-gray-900 text-cyan-200">
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
