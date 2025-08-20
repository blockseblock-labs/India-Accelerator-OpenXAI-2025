import React, { useState } from "react";
import jsPDF from "jspdf";

interface Metrics {
  co2Level: number;
  toxicityLevel: number;
  temperature: number;
  humanPopulation: number;
  animalPopulation: number;
  plantPopulation: number;
  oceanAcidity: number;
  iceCapMelting: number;
}

interface ComponentItem {
  type: string;
  quantity: number;
  spec?: string;
}

const initialMetrics: Metrics = {
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
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [components, setComponents] = useState<ComponentItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setAnalysis(null);
    setMetrics(null);
    setComponents([]);

    try {
      const res = await fetch("/api/process-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: search,
          currentMetrics: initialMetrics,
          pollutionLevel: initialPollutionLevel,
        }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setMetrics(data.metrics);
      setComponents(data.components || []);
      setSubmitted(true);
    } catch (err) {
      setAnalysis("Error processing your search. Please try again.");
      setMetrics(null);
      setComponents([]);
      setSubmitted(true);
    }
    setLoading(false);
  };

  const handleSell = (type: string) => {
    alert(`You have chosen to sell: ${type}.`);
    // Add more logic here if needed
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("🌱 Solve for Energy & Pollution", 10, 15);
    doc.setFontSize(12);
    doc.text(`Search Query: ${search}`, 10, 25);
    doc.text("Analysis:", 10, 35);

    if (analysis) {
      const lines = doc.splitTextToSize(analysis, 180);
      doc.text(lines, 10, 45);
    }

    let y = 55 + (analysis ? (jsPDF.prototype.splitTextToSize.call(doc, analysis, 180).length * 7) : 0);

    if (metrics) {
      doc.text("Metrics:", 10, y);
      y += 10;
      doc.text(`CO₂ Level: ${metrics.co2Level} ppm`, 10, y); y += 7;
      doc.text(`Toxicity Level: ${metrics.toxicityLevel} %`, 10, y); y += 7;
      doc.text(`Temperature: ${metrics.temperature} °C`, 10, y); y += 7;
      doc.text(`Human Population: ${metrics.humanPopulation.toLocaleString()}`, 10, y); y += 7;
      doc.text(`Animal Population: ${metrics.animalPopulation.toLocaleString()}`, 10, y); y += 7;
      doc.text(`Plant Population: ${metrics.plantPopulation.toLocaleString()}`, 10, y); y += 7;
      doc.text(`Ocean Acidity: ${metrics.oceanAcidity}`, 10, y); y += 7;
      doc.text(`Ice Cap Melting: ${metrics.iceCapMelting} %`, 10, y);
    }

    if (components.length > 0) {
      y += 10;
      doc.text("Recommended Components:", 10, y);
      y += 8;
      components.forEach((comp) => {
        doc.text(
          `${comp.type}: ${comp.quantity} ${comp.spec ? `(${comp.spec})` : ""}`,
          10,
          y
        );
        y += 7;
      });
    }

    doc.save("search-result-analysis.pdf");
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
      aria-label="Metrics Panel"
    >
      <h2 style={{ color: "#2e7d32", marginBottom: "16px" }}>
        🌱 Solve for Energy & Pollution
      </h2>
      <p style={{ color: "#333", fontSize: "1.1em" }}>
        Search for your energy or pollution solution. Enter your requirement (e.g. "I need 10kWh per day for my house") and get instant recommendations for solar panels, batteries, inverters, and see how much CO₂ you can save!
      </p>
      <form onSubmit={handleSubmit} style={{ marginTop: "28px" }}>
        <label htmlFor="search" style={{ fontWeight: "bold", color: "#1976d2" }}>
          Search your energy requirement or idea:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #90caf9",
            fontSize: "1em",
          }}
          placeholder="E.g. I need 10kWh per day for my house"
          required
          aria-required="true"
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          aria-busy={loading}
        >
          {loading && (
            <span
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid #fff",
                borderTop: "2px solid #94eb57ff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 1s linear infinite",
              }}
            />
          )}
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {submitted && (
        <div style={{ marginTop: "24px" }}>
          <div style={{ color: "#54ec5cff", fontWeight: "bold", marginBottom: "12px" }}>
            {analysis}
          </div>
          {metrics && (
            <div
              style={{
                background: "#f5f5f5",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(98,137,245,0.08)",
                color: "#47f380ff",
                fontSize: "1em",
              }}
              aria-live="polite"
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
          {components.length > 0 && (
            <div style={{ marginTop: "18px", background: "#fffde7", borderRadius: "8px", padding: "16px", boxShadow: "0 2px 8px rgba(255,235,59,0.08)" }}>
              <h3 style={{ color: "#fbc02d", marginBottom: "10px" }}>Recommended Components for Sale</h3>
              {components.map((comp, idx) => (
                <div key={idx} style={{ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>
                    <strong>{comp.type}</strong> — {comp.quantity} {comp.spec ? `(${comp.spec})` : ""}
                  </span>
                  <button
                    onClick={() => handleSell(comp.type)}
                    style={{
                      background: "#fbc02d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginLeft: "16px"
                    }}
                  >
                    Sell
                  </button>
                </div>
              ))}
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
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
export default MetricsPanel;