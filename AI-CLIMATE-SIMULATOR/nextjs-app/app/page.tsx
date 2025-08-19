'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Send, RotateCcw, Play, Pause, Brain, Loader2, BarChart2, MapPin } from 'lucide-react'
// NASA-style font (Orbitron or similar)


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
  // Process user command (async, as before)
  async function processUserCommand(command: string) {
    setIsProcessing(true)
    setAiThinkingLog([])
    setCurrentAnalysis('')
    setApiError(null)
    const startTime = Date.now()
    // Simulate AI thinking process
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
          model: 'llama3.2:1b',
        }),
      })
      if (!response.ok) {
        setApiError('Backend error: Failed to process command.');
        throw new Error('Failed to process command')
      }
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
      setApiError('Backend error: Failed to process command.');
      setCurrentAnalysis('Error: Failed to process command. Please try again.')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
    }
  }
  // Reset Earth to initial state
  function resetEarth() {
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
    setApiError(null)
  }

  // Handle form submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isProcessing && userInput.trim()) {
      processUserCommand(userInput.trim())
    }
  }

  // Handle clicking an example command
  function handleExampleClick(example: string) {
    if (isProcessing) return
    setUserInput(example)
    setTimeout(() => {
      processUserCommand(example)
    }, 100)
  }
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
  const [apiError, setApiError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // ...existing code...
  // ...existing code...
  // Show menu after analysis is displayed
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    if (currentAnalysis && !apiError) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  }, [currentAnalysis, apiError]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-orbitron">
      {/* Error message if backend fails */}
      {apiError && (
        <div className="absolute top-0 left-0 w-full z-50 bg-red-900/90 text-red-200 text-center py-3 font-bold text-lg shadow-lg">
          {apiError}
        </div>
      )}
      {/* Sci-fi animated space background */}
      <div className="absolute inset-0 z-0 animated-space-bg pointer-events-none" />
      {/* Sci-fi HUD overlay lines (SVG, inspired by reference images) */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{mixBlendMode:'screen'}}>
        <g stroke="#00eaff" strokeWidth="1.2" opacity="0.18">
          <rect x="2%" y="80%" width="96%" height="18%" rx="18" fill="none" />
          <rect x="70%" y="5%" width="28%" height="90%" rx="18" fill="none" />
          <circle cx="50%" cy="50%" r="36%" fill="none" />
          <circle cx="50%" cy="50%" r="30%" fill="none" />
          <circle cx="50%" cy="50%" r="22%" fill="none" />
          <line x1="0" y1="50%" x2="100%" y2="50%" />
          <line x1="50%" y1="0" x2="50%" y2="100%" />
        </g>
      </svg>
      {/* Earth Visualization (centered, larger, with glow) */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-[600px] h-[600px] max-w-full max-h-[60vh] drop-shadow-2xl">
          <Globe pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />
          {/* Earth glow/aurora effect */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl animate-pulse pointer-events-none" />
        </div>
      </div>
      {/* Earth Metrics Panel (bottom, sci-fi HUD) */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-30 pb-4">
        <div className="bg-black/60 border-t-2 border-cyan-400/40 rounded-t-2xl px-10 py-4 flex gap-10 shadow-2xl sci-fi-hud-metrics">
          <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} animate />
        </div>
      </div>
      {/* Reasoning/Analysis Panel (right, gamer font, sci-fi style) */}
      <div className="absolute top-0 right-0 h-full flex flex-col justify-center z-30 pr-8">
        <div className="bg-black/70 border-l-2 border-cyan-400/40 rounded-l-2xl px-8 py-6 w-[350px] max-w-xs shadow-2xl font-mono text-cyan-200 text-lg tracking-wider sci-fi-reasoning-panel">
          <h3 className="text-base font-bold mb-2 text-cyan-300 uppercase tracking-widest">IMPACT ANALYSIS</h3>
          <div className="max-h-96 overflow-y-auto text-cyan-100 text-base leading-relaxed whitespace-pre-line">
            {currentAnalysis || 'No analysis yet.'}
          </div>
        </div>
        {/* Ergonomic top-center floating menu for navigation after analysis */}
        {showMenu && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-black/80 border border-cyan-400/40 rounded-full px-4 py-2 shadow-xl backdrop-blur-md animate-fade-in">
              <Link href="/location" className="flex items-center gap-1 px-3 py-1 bg-green-700/70 hover:bg-green-800/90 rounded-full text-green-100 font-semibold text-sm transition">
                <MapPin size={16} /> Location
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1 px-3 py-1 bg-cyan-700/70 hover:bg-cyan-800/90 rounded-full text-cyan-100 font-semibold text-sm transition">
                <BarChart2 size={16} /> Dashboard
              </Link>
              <button onClick={() => setShowMenu(false)} className="ml-2 text-xs text-cyan-300 hover:text-cyan-100 transition underline">Close</button>
            </div>
          </div>
        )}
      </div>
      {/* AI Earth Controller (left, glassmorphic) */}
      <div className="absolute top-8 left-8 z-40">
        <div className="glass-panel p-6 w-[350px] max-w-xs flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-widest text-cyan-200 mb-2">AI EARTH CONTROLLER</h2>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="flex-1 flex items-center gap-2 px-3 py-2 bg-cyan-700/80 hover:bg-cyan-800/90 disabled:bg-gray-700/60 rounded shadow-lg uppercase tracking-wide font-semibold transition"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetEarth}
              className="flex-1 flex items-center gap-2 px-3 py-2 bg-green-600/80 hover:bg-green-700/90 rounded shadow-lg uppercase tracking-wide font-semibold transition"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mb-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your command..."
                disabled={isProcessing}
                className="flex-1 px-3 py-2 bg-black/60 border border-cyan-400/30 rounded text-white placeholder-gray-400 disabled:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 rounded flex items-center gap-2 shadow-lg transition"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Send
              </button>
            </div>
          </form>
          <div>
            <h3 className="text-xs font-semibold mb-1 text-cyan-300 tracking-widest">EXAMPLES</h3>
            <div className="grid grid-cols-1 gap-1">
              {exampleCommands.slice(0, 8).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  disabled={isProcessing}
                  className="w-full text-left px-2 py-1 text-xs bg-black/40 hover:bg-cyan-900/40 disabled:bg-gray-800/60 rounded text-cyan-200 disabled:text-gray-500 transition font-mono"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          {/* AI Thinking Log */}
          {aiThinkingLog.length > 0 && (
            <div className="mb-2">
              <h3 className="text-xs font-semibold mb-1 text-cyan-300 tracking-widest flex items-center gap-2">
                <Brain size={14} />
                AI Analysis
              </h3>
              <div className="space-y-1">
                {aiThinkingLog.map((step, index) => (
                  <div key={index} className="text-xs text-cyan-200 flex items-center gap-2 animate-pulse font-mono">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Command History (bottom right, glassmorphic) */}
      <div className="absolute bottom-8 right-8 z-40">
        <div className="glass-panel p-4 w-[350px] max-w-xs">
          <h3 className="text-xs font-semibold mb-2 text-cyan-300 tracking-widest">RECENT AI REQUESTS</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {commandHistory.map((cmd, index) => (
              <div key={index} className="text-xs border-l-2 border-cyan-400 pl-2 font-mono">
                <div className="text-cyan-300 mb-1">
                  <span className="font-semibold">{cmd.model}</span> • {cmd.responseTime.toFixed(1)}s
                </div>
                <div className="text-cyan-100 mb-1">{cmd.command}</div>
                <div className="text-cyan-500 text-xs">{cmd.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
            {commandHistory.length === 0 && (
              <div className="text-cyan-500 text-xs">No commands yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}