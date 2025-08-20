import React, { useState } from "react";
import jsPDF from "jspdf";

const initialMetrics = {
  co2Level: 415,
  toxicityLevel: 5,
  temperature: 30,
  humanPopulation: 9000000000,
  animalPopulation: 100000000000,
  plantPopulation: 1000000000000,
  oceanAcidity: 8.1,
  iceCapMelting: 10,
};

const initialPollutionLevel = 10;

const MetricsPanel: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setAnalysis(null);
    setMetrics(null);

    try {
      const res = await fetch("/api/process-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: idea,
          currentMetrics: initialMetrics,
          pollutionLevel: initialPollutionLevel,
        }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setMetrics(data.metrics);
      setSubmitted(true);
    } catch (err) {
      setAnalysis("Error processing your idea. Please try again.");
      setMetrics(null);
      setSubmitted(true);
    }
    setLoading(false);
    setIdea("");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("🌱 Solve for Energy & Pollution", 10, 15);
    doc.setFontSize(12);
    doc.text(`Your Idea: ${idea}`, 10, 25);
    doc.text("Analysis:", 10, 35);
    doc.text(analysis || "", 10, 45);

    if (metrics) {
      doc.text("Metrics:", 10, 55);
      doc.text(`CO₂ Level: ${metrics.co2Level} ppm`, 10, 65);
      doc.text(`Toxicity Level: ${metrics.toxicityLevel} %`, 10, 72);
      doc.text(`Temperature: ${metrics.temperature} °C`, 10, 79);
      doc.text(`Human Population: ${metrics.humanPopulation.toLocaleString()}`, 10, 86);
      doc.text(`Animal Population: ${metrics.animalPopulation.toLocaleString()}`, 10, 93);
      doc.text(`Plant Population: ${metrics.plantPopulation.toLocaleString()}`, 10, 100);
      doc.text(`Ocean Acidity: ${metrics.oceanAcidity}`, 10, 107);
      doc.text(`Ice Cap Melting: ${metrics.iceCapMelting} %`, 10, 114);
    }

    doc.save("energy-pollution-analysis.pdf");
  };

  return (
    <div
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(98,137,245,0.15)",
        border: "1px solid #78a3e9",
        padding: "32px",
        maxWidth: "540px",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        margin: "32px auto",
      }}
    >
      <h2 style={{ color: "#2e7d32", marginBottom: "16px" }}>
        🌱 Solve for Energy & Pollution
      </h2>
      <p style={{ color: "#333", fontSize: "1.1em" }}>
        Tackling energy efficiency and pollution is critical for a sustainable future.
        Innovative solutions can help reduce carbon emissions, optimize energy usage, and improve air quality.
      </p>
      <ul style={{ margin: "18px 0", paddingLeft: "20px", color: "#1565c0" }}>
        <li><strong>Renewable Energy:</strong> Promote solar, wind, and hydro power adoption.</li>
        <li><strong>Smart Grids:</strong> Use technology to optimize energy distribution and reduce waste.</li>
        <li><strong>Pollution Monitoring:</strong> Deploy sensors to track air and water quality in real time.</li>
        <li><strong>Green Transportation:</strong> Encourage electric vehicles and public transit.</li>
        <li><strong>Waste Reduction:</strong> Support recycling and circular economy initiatives.</li>
      </ul>
      <form onSubmit={handleSubmit} style={{ marginTop: "28px" }}>
        <label htmlFor="idea" style={{ fontWeight: "bold", color: "#1976d2" }}>
          Share your idea or solution:
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #90caf9",
            fontSize: "1em",
            resize: "vertical",
          }}
          placeholder="Describe your idea here..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "12px",
            background: loading ? "#90caf9" : "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 24px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {submitted && (
        <div style={{ marginTop: "24px" }}>
          <div style={{ color: "#388e3c", fontWeight: "bold", marginBottom: "12px" }}>
            {analysis}
          </div>
          {metrics && (
            <div
              style={{
                background: "#f5f5f5",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(98,137,245,0.08)",
                color: "#1976d2",
                fontSize: "1em",
              }}
            >
              <div><strong>CO₂ Level:</strong> {metrics.co2Level} ppm</div>
              <div><strong>Toxicity Level:</strong> {metrics.toxicityLevel} %</div>
              <div><strong>Temperature:</strong> {metrics.temperature} °C</div>
              <div><strong>Human Population:</strong> {metrics.humanPopulation.toLocaleString()}</div>
              <div><strong>Animal Population:</strong> {metrics.animalPopulation.toLocaleString()}</div>
              <div><strong>Plant Population:</strong> {metrics.plantPopulation.toLocaleString()}</div>
              <div><strong>Ocean Acidity:</strong> {metrics.oceanAcidity}</div>
              <div><strong>Ice Cap Melting:</strong> {metrics.iceCapMelting} %</div>
            </div>
          )}
          <button
            onClick={handleDownloadPDF}
            style={{
              marginTop: "18px",
              background: "#43a047",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(67,160,71,0.08)",
              transition: "background 0.2s",
            }}
          >
            Download Result as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;