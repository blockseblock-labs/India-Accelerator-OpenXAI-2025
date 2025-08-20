'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Send, Loader2, Brain } from 'lucide-react'

// Dynamically import the 3D components to avoid SSR issues
const Globe = dynamic(() => import('../components/Globe'), { ssr: false })
const MetricsPanel = dynamic(() => import('../components/MetricsPanel'), { ssr: false })

const defaultPrompt = (
  dailyUsage: number,
  budget: number,
  unitBill: number
) => `My home uses ${dailyUsage}kWh per day. My budget is ₹${budget}. My electricity bill per unit is ₹${unitBill}. 
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

  // AI thinking process simulation
  const thinkingSteps = [
    "Analyzing your home energy needs...",
    "Calculating solar panel requirements...",
    "Estimating battery and inverter size...",
    "Checking accessory recommendations...",
    "Calculating CO₂ savings...",
    "Calculating payback period...",
    "Preparing installation flow chart...",
    "Finalizing your solar solution..."
  ]

  // Generate prompt whenever inputs change
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

    // Simulate AI thinking process
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
        {
          command,
          analysis: data.analysis,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ])
    } catch (error) {
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

  const handleExampleClick = () => {
    if (isProcessing) return
    setUserInput(defaultPrompt(dailyUsage, budget, unitBill))
    setTimeout(() => {
      processUserCommand(defaultPrompt(dailyUsage, budget, unitBill))
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

  // PDF Download Handler (with improved formatting)
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    doc.setFontSize(18)
    doc.text("🌱 Solar Solution & Payback Analysis", 10, 15)
    doc.setFontSize(12)
    doc.text(`Daily Power Usage: ${dailyUsage} kWh`, 10, 25)
    doc.text(`Budget: ₹${budget}`, 10, 32)
    doc.text(`Per Unit Bill: ₹${unitBill}`, 10, 39)
    doc.text("Your Solar Solution:", 10, 47)
    doc.setFont("courier", "normal")
    doc.setFontSize(11)
    doc.text(currentAnalysis || "No analysis yet.", 10, 55, { maxWidth: 190 })
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text("Metrics:", 10, 70)
    doc.text(`CO₂ Level: ${metrics.co2Level} ppm`, 10, 77)
    doc.text(`Toxicity Level: ${metrics.toxicityLevel} %`, 10, 84)
    doc.text(`Temperature: ${metrics.temperature} °C`, 10, 91)
    doc.text(`Human Population: ${metrics.humanPopulation.toLocaleString()}`, 10, 98)
    doc.text(`Animal Population: ${metrics.animalPopulation.toLocaleString()}`, 10, 105)
    doc.text(`Plant Population: ${metrics.plantPopulation.toLocaleString()}`, 10, 112)
    doc.text(`Ocean Acidity: ${metrics.oceanAcidity}`, 10, 119)
    doc.text(`Ice Cap Melting: ${metrics.iceCapMelting} %`, 10, 126)
    if (components.length > 0) {
      autoTable(doc, {
        startY: 132,
        head: [['Type', 'Quantity', 'Spec']],
        body: components.map((comp: any) => [
          comp.type,
          comp.quantity,
          comp.spec || ''
        ]),
        theme: 'grid',
        styles: { fontSize: 11 }
      })
    }
    if (paybackDays !== null) {
      doc.text(`Payback Period: ${paybackDays} days`, 10, doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150)
    }
    if (flowChart.length > 0) {
      doc.setFontSize(13)
      doc.text("Installation Flow Chart:", 10, doc.lastAutoTable ? doc.lastAutoTable.finalY + 18 : 160)
      doc.setFontSize(11)
      flowChart.forEach((step, idx) => {
        doc.text(`${idx + 1}. ${step}`, 12, (doc.lastAutoTable ? doc.lastAutoTable.finalY + 25 : 167) + idx * 7)
      })
    }
    doc.save("solar-solution-analysis.pdf")
  }

  return (
    <div className="globe-container">
      {/* 3D Globe */}
      <Globe pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <div className="metrics-panel rounded-lg p-4 mb-4 max-w-sm max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">🌱 Solar Solution & Payback</h2>
          <p className="mb-2 text-gray-300">
            Enter your home's daily power usage, budget, and per unit bill. Our system will recommend solar panels, batteries, inverter, accessories, show CO₂ savings, installation flow chart, and payback period!
          </p>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-2">
              <label className="block text-sm text-gray-300 mb-1">Daily Power Usage (kWh):</label>
              <input
                type="number"
                min={1}
                max={100}
                step={0.1}
                value={dailyUsage}
                onChange={e => setDailyUsage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                required
                ref={inputRef}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm text-gray-300 mb-1">Budget (₹):</label>
              <input
                type="number"
                min={10000}
                max={1000000}
                step={1000}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm text-gray-300 mb-1">Per Unit Bill (₹):</label>
              <input
                type="number"
                min={1}
                max={50}
                step={0.1}
                value={unitBill}
                onChange={e => setUnitBill(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing || !userInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded flex items-center gap-2 w-full font-bold"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {isProcessing ? "Processing..." : "Get Solar Solution"}
            </button>
          </form>
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Example:</h3>
            <button
              onClick={handleExampleClick}
              disabled={isProcessing}
              className="block w-full text-left px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded text-gray-300 disabled:text-gray-500"
            >
              {defaultPrompt(dailyUsage, budget, unitBill)}
            </button>
          </div>
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
          {currentAnalysis && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Solar Solution:</h3>
              <div className="max-h-32 overflow-y-auto bg-gray-800 p-3 rounded">
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentAnalysis}
                </div>
              </div>
              {components.length > 0 && (
                <div className="mt-3 bg-yellow-50 rounded p-3">
                  <h4 className="text-yellow-700 font-bold mb-2">Recommended Components:</h4>
                  {components.map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                      <span>
                        <strong>{comp.type}</strong> — {comp.quantity} {comp.spec ? `(${comp.spec})` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {paybackDays !== null && (
                <div className="mt-3 bg-green-50 rounded p-3">
                  <h4 className="text-green-700 font-bold mb-2">Payback Period:</h4>
                  <span className="text-green-800 font-bold">{paybackDays} days</span>
                </div>
              )}
              {flowChart.length > 0 && (
                <div className="mt-3 bg-blue-50 rounded p-3">
                  <h4 className="text-blue-700 font-bold mb-2">Installation Flow Chart:</h4>
                  <ol className="list-decimal ml-4 text-blue-900">
                    {flowChart.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
              <button
                onClick={handleDownloadPDF}
                className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
              >
                Download Result as PDF
              </button>
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
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Recent Requests:</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {commandHistory.map((cmd, index) => (
              <div key={index} className="text-xs border-l-2 border-blue-500 pl-2">
                <div className="text-gray-400 mb-1">{cmd.command}</div>
                <div className="text-gray-500 text-xs">{cmd.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
            {commandHistory.length === 0 && (
              <div className="text-gray-500 text-xs">No requests yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="absolute bottom-4 left-4 z-20">
        <button
          onClick={resetEarth}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
        >
          Reset All
        </button>
      </div>
    </div>
  )
}