import React from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Metrics {
  co2Level: number
  toxicityLevel: number
  temperature: number
  humanPopulation: number
  animalPopulation: number
  plantPopulation: number
  oceanAcidity: number
  iceCapMelting: number
}

interface ComponentItem {
  type: string
  quantity: number
  spec?: string
}

interface Props {
  metrics: Metrics
  analysis: string
  components: ComponentItem[]
  paybackDays: number | null
  flowChart: string[]
  aiThinkingLog?: string[]  // Optional, so default can be supplied
}

const MetricsPanel: React.FC<Props> = ({
  metrics,
  analysis,
  components,
  paybackDays,
  flowChart,
  aiThinkingLog = [],     // Default value here FIXES the crash
}) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("🌱 Solar Analysis & Payback Report", 10, 20)

    doc.setFontSize(12)
    doc.text("Analysis:", 10, 35)
    doc.text(analysis || "No analysis yet.", 10, 45, { maxWidth: 180 })

    doc.text("Metrics:", 10, 70)
    doc.text(`CO₂ Level: ${metrics.co2Level}`, 10, 80)
    doc.text(`Toxicity Level: ${metrics.toxicityLevel}`, 10, 87)
    doc.text(`Temperature: ${metrics.temperature} °C`, 10, 94)

    if (components.length > 0) {
      autoTable(doc, {
        startY: 110,
        head: [["Type", "Quantity", "Spec"]],
        body: components.map(c => [c.type, c.quantity, c.spec || "-"]),
      })
    }

    if (paybackDays) {
      doc.text(`Payback: ${paybackDays} days`, 10, doc.lastAutoTable?.finalY + 15 || 140)
    }

    if (flowChart.length > 0) {
      let y = doc.lastAutoTable?.finalY + 25 || 160
      doc.text("Installation Flow Chart:", 10, y)
      flowChart.forEach((step, i) => {
        doc.text(`${i + 1}. ${step}`, 12, y + 8 + i * 7)
      })
    }

    doc.save("solar-analysis.pdf")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full text-gray-900 max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-3">AI Solar Recommendation</h3>

      {/* AI Thinking Log */}
      {aiThinkingLog.length > 0 && (
        <div className="mb-3 p-2 bg-blue-50 rounded">
          <p className="font-semibold text-blue-800 text-sm mb-1">AI Thinking...</p>
          {aiThinkingLog.map((log, i) => (
            <div key={i} className="text-xs text-gray-600">• {log}</div>
          ))}
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div className="bg-gray-100 p-3 rounded mb-3">
          <p className="whitespace-pre-line text-sm">{analysis}</p>
        </div>
      )}

      {/* Components */}
      {components.length > 0 && (
        <div className="bg-yellow-50 p-3 rounded mb-3">
          <h4 className="font-semibold text-yellow-700 mb-2">Recommended Components</h4>
          {components.map((c, i) => (
            <div key={i} className="text-sm mb-1">✅ {c.type} — {c.quantity} {c.spec && `(${c.spec})`}</div>
          ))}
        </div>
      )}

      {/* Payback */}
      {paybackDays && (
        <div className="bg-green-50 p-3 rounded mb-3">
          <h4 className="font-semibold text-green-800">Payback Period</h4>
          <p className="text-green-700 font-bold">{paybackDays} days</p>
        </div>
      )}

      {/* Flow Chart */}
      {flowChart.length > 0 && (
        <div className="bg-blue-50 p-3 rounded mb-3">
          <h4 className="font-semibold text-blue-800 mb-2">Installation Flow</h4>
          <ol className="list-decimal ml-4 text-sm text-blue-900">
            {flowChart.map((f, i) => <li key={i} className="mb-1">{f}</li>)}
          </ol>
        </div>
      )}

      <button onClick={handleDownloadPDF} className="w-full py-2 mt-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold">
        Download as PDF
      </button>
    </div>
  )
}

export default MetricsPanel
