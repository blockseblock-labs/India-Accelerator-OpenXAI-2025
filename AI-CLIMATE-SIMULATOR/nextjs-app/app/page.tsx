'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { 
  Send, RotateCcw, Play, Pause, Brain, Users, Thermometer, 
  AlertTriangle, Loader2, Zap, Activity, Globe as GlobeIcon,
  ChevronDown, ChevronUp, Sparkles, TrendingUp, TrendingDown
} from 'lucide-react'

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
  const [selectedModel, setSelectedModel] = useState('llama3.2:1b')
  const [showCommands, setShowCommands] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected')
  const inputRef = useRef<HTMLInputElement>(null)

  const thinkingSteps = [
    "Initializing environmental analysis...",
    "Processing climate impact vectors...",
    "Computing atmospheric changes...",
    "Analyzing population dynamics...",
    "Evaluating ecosystem disruption...",
    "Calculating temperature variations...",
    "Assessing biodiversity impact...",
    "Generating impact projections..."
  ]

  const processUserCommand = async (command: string) => {
    setIsProcessing(true)
    setAiThinkingLog([])
    setCurrentAnalysis('')
    setConnectionStatus('connecting')
    
    const startTime = Date.now()
    
    // Enhanced AI thinking process with staggered animations
    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100))
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
        throw new Error('Failed to process command')
      }

      const data = await response.json()
      const endTime = Date.now()
      const responseTime = (endTime - startTime) / 1000

      setMetrics(data.metrics)
      setPollutionLevel(data.pollutionLevel)
      setCurrentAnalysis(data.analysis)
      setSpecialEvent(data.specialEvent)
      setConnectionStatus('connected')

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
      setConnectionStatus('disconnected')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
      setUserInput('')
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
    setConnectionStatus('connected')
  }

  const getHealthStatus = (value: number, thresholds: { good: number, warning: number }) => {
    if (value <= thresholds.good) return 'healthy'
    if (value <= thresholds.warning) return 'warning'
    return 'critical'
  }

  const overallHealthStatus = () => {
    const criticalCount = [
      metrics.co2Level > 800,
      metrics.toxicityLevel > 50,
      metrics.temperature > 40,
      metrics.oceanAcidity < 7.5,
      metrics.iceCapMelting > 50
    ].filter(Boolean).length

    if (criticalCount >= 3) return 'critical'
    if (criticalCount >= 1) return 'warning'
    return 'healthy'
  }

  // Auto-simulation loop
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
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="globe-container">
      {/* Enhanced header with status indicators */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex justify-between items-center">
          <div className="glass-panel px-6 py-3 fade-in">
            <h1 className="text-xl font-bold gradient-text">Dead-Earth Project - UI tweaked by Mihir Gahukar</h1>
            <p className="text-xs text-white/60 mt-1">Climate Change Simulation v2.0</p>
          </div>
          
          <div className="flex items-center gap-4 fade-in fade-in-delay-1">
            <div className={`status-indicator status-${overallHealthStatus()}`}>
              <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
              Planet Status: {overallHealthStatus().charAt(0).toUpperCase() + overallHealthStatus().slice(1)}
            </div>
            
            <div className={`status-indicator ${connectionStatus === 'connected' ? 'status-healthy' : connectionStatus === 'connecting' ? 'status-warning' : 'status-critical'}`}>
              <Activity size={12} />
              AI: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Globe */}
      <Globe 
        pollutionLevel={pollutionLevel} 
        metrics={metrics} 
        specialEvent={specialEvent}
      />
      
      {/* Enhanced Control Panel */}
      <div className="absolute top-20 left-4 z-20 fade-in fade-in-delay-2">
        <div className="glass-panel p-6 mb-4 max-w-sm max-h-[calc(100vh-200px)] overflow-y-auto float-animation">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Earth Controller</h2>
              <p className="text-xs text-white/60">Environmental Impact Simulator</p>
            </div>
          </div>
          
          {/* Enhanced Simulation Controls */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="gradient-button flex items-center justify-center gap-2"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetEarth}
              className="gradient-button flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)' }}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Enhanced Command Input */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your environmental impact..."
                disabled={isProcessing}
                className="glass-input w-full pr-12"
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={16} className="loading-spinner text-blue-400" /> : <Send size={16} className="text-blue-400" />}
              </button>
            </div>
          </form>

          {/* Collapsible Example Commands */}
          <div className="mb-6">
            <button
              onClick={() => setShowCommands(!showCommands)}
              className="flex items-center justify-between w-full text-sm font-semibold text-white/80 mb-3 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} />
                Example Commands
              </span>
              {showCommands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showCommands && (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {exampleCommands.slice(0, 6).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    disabled={isProcessing}
                    className="command-button"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced AI Thinking Log */}
          {aiThinkingLog.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="thinking-dot"></div>
                <h3 className="text-sm font-semibold text-white/80">AI Analysis in Progress</h3>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {aiThinkingLog.map((step, index) => (
                  <div key={index} className="thinking-step text-xs text-white/60 flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Current Analysis */}
          {currentAnalysis && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-white/80">Impact Analysis</h3>
              </div>
              <div className="metric-card">
                <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                  {currentAnalysis}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Metrics Panel */}
      <div className="absolute top-20 right-4 z-20 fade-in fade-in-delay-3">
        <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} />
      </div>

      {/* Enhanced Command History */}
      <div className="absolute bottom-4 right-4 z-20 fade-in fade-in-delay-3">
        <div className="glass-panel p-4 max-w-md">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-sm font-semibold text-white/80 mb-3 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Activity size={14} />
              Recent AI Requests ({commandHistory.length})
            </span>
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showHistory && (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {commandHistory.map((cmd, index) => (
                <div key={index} className="command-history-item">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                    <span className="font-semibold text-blue-400">{cmd.model}</span>
                    <span>{cmd.responseTime.toFixed(1)}s</span>
                  </div>
                  <div className="text-sm text-white/80 mb-1 truncate">{cmd.command}</div>
                  <div className="text-xs text-white/50">{cmd.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
              {commandHistory.length === 0 && (
                <div className="text-center text-white/50 text-sm py-4">
                  No commands executed yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Model Selection */}
      <div className="absolute bottom-4 left-4 z-20 fade-in fade-in-delay-2">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/80">AI Model</h3>
          </div>
          
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel('llama3.2:1b')}
            className="model-select w-full"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id} disabled={model.disabled}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
          
          <div className="mt-2 text-xs text-white/50">
            Currently using optimized inference
          </div>
        </div>
      </div>
    </div>
  )
}