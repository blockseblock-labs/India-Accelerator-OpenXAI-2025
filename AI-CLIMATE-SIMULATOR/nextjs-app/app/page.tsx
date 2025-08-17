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
  "Erupt all volcanoes simultaneously"
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
  const [selectedModel, setSelectedModel] = useState('llama3.2:1b')
  const inputRef = useRef<HTMLInputElement>(null)

  // **Sun ref for animation**
  const sunRef = useRef<HTMLDivElement>(null)

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
        model: 'llama3.2:1b'
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
    if (!isProcessing && userInput.trim()) processUserCommand(userInput.trim())
  }

  const handleExampleClick = (example: string) => {
    if (isProcessing) return
    setUserInput(example)
    setTimeout(() => { processUserCommand(example) }, 100)
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

  useEffect(() => { if (inputRef.current) inputRef.current.focus() }, [])

  // **Sun movement effect**
  useEffect(() => {
    let start: number | null = null

    const animateSun = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start

      if (sunRef.current) {
        const t = (elapsed % 20000) / 20000 // 20s cycle
        const x = t * window.innerWidth
        const y = window.innerHeight * 0.8 - Math.sin(t * Math.PI) * window.innerHeight * 0.3
        sunRef.current.style.transform = `translate(${x}px, ${y}px)`
      }

      requestAnimationFrame(animateSun)
    }

    requestAnimationFrame(animateSun)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-green-900 overflow-hidden">
      
      {/* Optional floating clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[url('/clouds.png')] bg-no-repeat bg-cover animate-clouds opacity-20"></div>
      </div>

      {/* Page Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-30">
        <h1 className="text-5xl font-extrabold text-green-400 animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] text-5xl font-bold text-green-500 drop-shadow-lg">
          🌍 Dead Earth Simulator – Shreya Edition
        </h1>
        <p className="mt-2 text-lg text-white/80 drop-shadow-md">Explore climate change with AI-powered simulations.</p>
      </div>

      {/* 3D Globe restored to original size */}
      <div className="w-full h-screen">
        <Globe 
          pollutionLevel={pollutionLevel} 
          metrics={metrics} 
          specialEvent={specialEvent} 
        />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.7} position={[5, 5, 5]} />
      </div>

      {/* Sun in the sky */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="sun" ref={sunRef}></div>
      </div>

      {/* ... rest of your original code remains unchanged ... */}





      {/* Pollution Overlay */}
      {pollutionLevel > 0 && (
        <div className="absolute inset-0 bg-red-500 opacity-[0.15] pointer-events-none bsolute inset-0 bg-red-500 opacity-20 animate-pulse-slow"></div>
        
      )}

      {/* Control Panel */}
      <div className="absolute top-24 left-4 z-20 animate-float">
        <div className="metrics-panel rounded-lg p-4 mb-4 max-w-sm max-h-[80vh] overflow-y-auto bg-gray-900/70 backdrop-blur-md shadow-lg ring-1 ring-white/10">
          
          <h2 className="text-xl font-bold mb-2 text-white/90 flex items-center gap-2">
            <Brain size={18} /> AI Earth Controller
          </h2>

          {/* Simulation Controls */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-600"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetEarth}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-105 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded
  hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-md"
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
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg
  placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500
  transition-all duration-300 flex-1 px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-white font-semibold shadow-md flex items-center gap-2 transition-transform transform hover:scale-105 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded
  hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-md"
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
    {exampleCommands
      .filter(cmd => cmd.toLowerCase().includes(userInput.toLowerCase()))
      .map((cmd, i) => (
        <div
          key={i}
          onClick={() => handleExampleClick(cmd)}
          className="cursor-pointer hover:bg-gray-700 px-2 py-1 rounded text-gray-300 text-xs"
        >
          {cmd}
        </div>
    ))}
  </div>
</div>



          {/* AI Thinking Log */}
          {aiThinkingLog.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                <Brain size={14} /> AI Analysis:
              </h3>
              <div className="space-y-1">
                {aiThinkingLog.map((step, index) => (
                  <div key={index} className="text-xs text-cyan-400 flex items-center gap-2">
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
              <div className="max-h-32 overflow-y-auto bg-gray-800/70 p-3 rounded shadow-inner">
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentAnalysis}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="absolute top-24 right-4 z-20 animate-float metrics-panel rounded-lg p-4 mb-4 max-w-sm max-h-[80vh] overflow-y-auto
  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
        <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} />
      </div>

      {/* Command History */}
      <div className="absolute bottom-4 right-4 z-20 animate-float">
        <div className="metrics-panel rounded-lg p-4 max-w-md bg-gray-900/70 backdrop-blur-md shadow-lg ring-1 ring-white/10 overflow-y-auto max-h-48">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Recent AI Requests:</h3>
          <div className="space-y-2">
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
      <div className="absolute bottom-4 left-4 z-20 animate-float">
        <div className="metrics-panel rounded-lg p-4 bg-gray-900/70 backdrop-blur-md shadow-lg ring-1 ring-white/10">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">AI Model:</h3>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel('llama3.2:1b')}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm disabled:bg-gray-700"
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
