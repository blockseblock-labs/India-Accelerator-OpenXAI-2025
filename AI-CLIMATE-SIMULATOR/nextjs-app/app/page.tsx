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
]

const availableModels = [
  { id: 'llama3.2:1b', name: 'Llama 3.2 (1B)', description: 'Fast, minimal reasoning (default)', disabled: false },
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

  // Simulated AI thinking steps
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
          model: 'llama3.2:1b',
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
        model: 'llama3.2:1b'
      }
      setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)])
    } catch (error) {
      console.error(error)
      setCurrentAnalysis('Error: Failed to process command. Please try again.')
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
    setIsSimulationRunning(false)
    setCommandHistory([])
    setCurrentAnalysis('')
    setSpecialEvent(null)
    setAiThinkingLog([])
    setIsProcessing(false)
  }

  // auto simulation (slowed down)
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
          🌍 AI Climate Simulator
        </h1>
      
      </header>

      {/* 3D Globe */}
      <Globe pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />

      {/* Pollution Overlay */}
      {pollutionLevel > 0 && (
        <div 
          className="absolute inset-0 bg-red-500 opacity-20"
          style={{ opacity: Math.min(pollutionLevel / 100 * 0.4, 0.4) }}
        />
      )}

      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <div className="backdrop-blur-md bg-gray-800/70 rounded-xl p-4 shadow-xl max-w-sm max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-3">AI Earth Controller</h2>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetEarth}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a command..."
                disabled={isProcessing}
                className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 disabled:bg-gray-600"
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md flex items-center gap-2 transition"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Send
              </button>
            </div>
          </form>

          {/* Example Commands */}
          <h3 className="text-sm font-semibold mb-2">Try these:</h3>
          <div className="space-y-1">
            {exampleCommands.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(example)}
                disabled={isProcessing}
                className="w-full text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition"
              >
                {example}
              </button>
            ))}
          </div>

          {/* AI Thinking Log */}
          {aiThinkingLog.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Brain size={14} /> AI Thinking...
              </h3>
              <div className="space-y-1">
                {aiThinkingLog.map((step, idx) => (
                  <div key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis */}
          {currentAnalysis && (
            <div className="mt-4 bg-gray-700 p-3 rounded-lg text-sm">
              <h3 className="font-semibold mb-1">Impact Analysis:</h3>
              <p className="text-gray-300 whitespace-pre-line">{currentAnalysis}</p>
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
        <div className="backdrop-blur-md bg-gray-800/70 rounded-xl p-4 shadow-xl max-w-md">
          <h3 className="text-sm font-semibold mb-2">Recent Commands:</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {commandHistory.length > 0 ? commandHistory.map((cmd, i) => (
              <div key={i} className="text-xs border-l-2 border-blue-500 pl-2">
                <div className="text-gray-400 mb-1">
                  <span className="font-semibold">{cmd.model}</span> • {cmd.responseTime.toFixed(1)}s
                </div>
                <div className="text-gray-300">{cmd.command}</div>
                <div className="text-gray-500 text-xs">{cmd.timestamp.toLocaleTimeString()}</div>
              </div>
            )) : <div className="text-gray-500 text-xs">No commands yet</div>}
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="backdrop-blur-md bg-gray-800/70 rounded-xl p-4 shadow-xl">
          <h3 className="text-sm font-semibold mb-2">AI Model</h3>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel('llama3.2:1b')}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white text-sm"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-gray-400 text-sm">
        Built with ❤️ by SHRAVANI PANDE
      </footer>
    </div>
  )
}
