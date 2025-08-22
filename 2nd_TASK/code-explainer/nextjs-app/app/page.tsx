"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CodeEditor from "@/components/CodeEditor";
import ModeSelector from "@/components/ModeSelector";
import OutputPanel from "@/components/OutputPanel";

export default function HomePage() {
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("comment");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!code.trim()) return;
    setOutput("");
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, mode }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      setOutput((prev) => prev + decoder.decode(value));
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      {/* Split screen layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* Left: Editor + Buttons */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <CodeEditor code={code} setCode={setCode} />
          <ModeSelector
            mode={mode}
            setMode={setMode}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>

        {/* Right: Output */}
        <div className="lg:w-1/2 flex flex-col">
          <OutputPanel output={output} loading={loading} />
        </div>
      </div>
    </main>
  );
}
