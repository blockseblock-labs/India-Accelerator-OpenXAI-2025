"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { jsPDF } from "jspdf";  // Step 1: Import jsPDF

export function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  // Step 2: Add PDF download function
  const downloadInvoicePDF = (invoiceText: string) => {
    const doc = new jsPDF();
    const lines = invoiceText.split('\n');
    let y = 10;
    lines.forEach(line => {
      doc.text(line, 10, y);
      y += 10;
    });
    doc.save("invoice.pdf");
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to process invoice");
      }

      const data = await response.json();
      setGeneratedText(data.response || "⚠️ No invoice generated. Try again.");
    } catch (error) {
      console.error("Error:", error);
      setGeneratedText("❌ Error processing invoice. Check logs.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "white", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Left Panel */}
        <div style={{ backgroundColor: "#111111", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(75, 85, 99, 0.5)" }}>
          <h2 style={{ color: "#00e5ff", fontSize: "1.25rem", fontWeight: 500, marginBottom: "1rem" }}>
            Paste Email / Text
          </h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste client email or text here..."
            style={{
              width: "100%",
              height: "240px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(75, 85, 99, 0.5)",
              borderRadius: "12px",
              padding: "1rem",
              color: "#d1d5db",
              marginBottom: "1rem",
              resize: "none",
              outline: "none",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#00e5ff",
              color: "black",
              borderRadius: "12px",
              fontWeight: 500,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Regenerate Invoice"}
          </button>
        </div>

        {/* Right Panel */}
        <div style={{ backgroundColor: "#111111", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(75, 85, 99, 0.5)" }}>
          <h2
            style={{
              color: "#bf5af2",
              fontSize: "1.25rem",
              fontWeight: 500,
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.8 }}
            >
              <path
                d="M21 7L12 2L3 7M21 7L12 12M21 7V17L12 22M12 12L3 7M12 12V22M3 7V17L12 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Generated Invoice
          </h2>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(75, 85, 99, 0.5)",
              borderRadius: "12px",
              padding: "1rem",
              height: "240px",
              marginBottom: "1rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "#d1d5db",
              whiteSpace: "pre",
              overflowY: "auto",
            }}
          >
            {generatedText || "------------------------\nInvoice will appear here..."}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={copyToClipboard}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "#d1d5db",
                cursor: "pointer",
              }}
            >
              <Copy style={{ width: "1rem", height: "1rem", opacity: 0.8 }} />
              <span>Copy</span>
            </button>

            {/* Step 3: Update PDF button onClick */}
            <button
              onClick={() => downloadInvoicePDF(generatedText)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "8px",
                fontSize: "0.875rem",
                color: "#d1d5db",
                cursor: "pointer",
              }}
            >
              PDF
            </button>

            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "8px",
                fontSize: "0.875rem",
                color: "#d1d5db",
                cursor: "pointer",
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
