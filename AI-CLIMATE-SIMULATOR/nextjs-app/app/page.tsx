'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Send, RotateCcw, Play, Pause, Brain, Users, Thermometer, AlertTriangle, Loader2 } from 'lucide-react'

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
    co2Level: 415, // Starting CO2 level (ppm)
    toxicityLevel: 5, // Starting toxicity level (1-100)
    temperature: 30, // Starting temperature (°C) - hotter baseline
    humanPopulation: 9000000000, // 9 billion humans
    animalPopulation: 100000000000, // 100 billion animals
    plantPopulation: 1000000000000,
    oceanAcidity: 8.1, // pH level
    iceCapMelting: 10, // Percentage melted
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

  // AI thinking process simulation
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
    
    // Simulate AI thinking process
    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setAiThinkingLog(prev => [...prev, thinkingSteps[i]])
    }

    try {
      const response = await fetch('/api/process-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          currentMetrics: metrics,
          pollutionLevel,
          model: 'llama3.2:1b', // Always use llama3.2:1b
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process command')
      }

      const data = await response.json()
      const endTime = Date.now()
      const responseTime = (endTime - startTime) / 1000

      // Update metrics
      setMetrics(data.metrics)
      setPollutionLevel(data.pollutionLevel)
      setCurrentAnalysis(data.analysis)
      setSpecialEvent(data.specialEvent)

      // Add to command history
      const newCommand: AICommand = {
        command,
        analysis: data.analysis,
        timestamp: new Date(),
        responseTime,
        model: 'llama3.2:1b' // Always use llama3.2:1b
      }
      setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)]) // Keep last 10

    } catch (error) {
      console.error('Error processing command:', error)
      setCurrentAnalysis('Error: Failed to process command. Please try again.')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
      // Special events are permanent until full reset or God save
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
    // Auto-submit after a short delay
    setTimeout(() => {
      processUserCommand(example)
    }, 100)
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

  // Auto-simulation loop for continuous degradation
  useEffect(() => {
    if (!isSimulationRunning || isProcessing) return // Pause auto-sim when processing commands

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        co2Level: Math.min(prev.co2Level + 0.1, 2000), // Much slower degradation
        toxicityLevel: Math.min(prev.toxicityLevel + 0.05, 100),
        temperature: Math.min(prev.temperature + 0.01, 50),
        humanPopulation: Math.max(prev.humanPopulation - 100, 0),
        animalPopulation: Math.max(prev.animalPopulation - 500, 0),
        plantPopulation: Math.max(prev.plantPopulation - 5000, 0),
        oceanAcidity: Math.max(prev.oceanAcidity - 0.001, 6.0),
        iceCapMelting: Math.min(prev.iceCapMelting + 0.05, 100),
      }))
    }, 5000) // Much slower - every 5 seconds instead of 2

    return () => clearInterval(interval)
  }, [isSimulationRunning, isProcessing]) // Also depend on isProcessing

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="globe-container">
      {/* 3D Globe */}
      <Globe 
        pollutionLevel={pollutionLevel} 
        metrics={metrics} 
        specialEvent={specialEvent}
      />
      
      {/* Pollution Overlay */}
      <div className="pollution-overlay">
        {pollutionLevel > 0 && (
          <div 
            className="absolute inset-0 bg-red-500 opacity-20"
            style={{ opacity: Math.min(pollutionLevel / 100 * 0.4, 0.4) }}
          />
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <div className="metrics-panel rounded-lg p-4 mb-4 max-w-sm max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">AI Earth Controller</h2>
          
          {/* Simulation Controls */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'} Auto-Simulation
            </button>
            <button
              onClick={resetEarth}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              <RotateCcw size={16} />
              Reset Earth
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
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 disabled:bg-gray-700"
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded flex items-center gap-2"
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
                  className="block w-full text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded text-gray-300 disabled:text-gray-500"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* AI Thinking Log */}
          {aiThinkingLog.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                <Brain size={14} />
                AI Analysis:
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
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Impact Analysis:</h3>
              <div className="max-h-32 overflow-y-auto bg-gray-800 p-3 rounded">
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
        <div className="metrics-panel rounded-lg p-4 max-w-md">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Recent AI Requests:</h3>
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
        <div className="metrics-panel rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">AI Model:</h3>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel('llama3.2:1b')}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm disabled:bg-gray-700"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id} disabled={model.disabled}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
} 