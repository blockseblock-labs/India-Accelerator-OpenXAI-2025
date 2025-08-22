"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { saveAs } from "file-saver";

interface OutputPanelProps {
  output: string;
  loading: boolean;
}

export default function OutputPanel({ output, loading }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "ai-output.md");
  };

  return (
    <div className="h-full flex flex-col bg-white/10 border border-gray-700 rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">AI Output</h2>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            disabled={!output}
            className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadOutput}
            disabled={!output}
            className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-950/70 text-gray-100 p-4 rounded-xl text-sm prose prose-invert max-w-none">
        {loading ? (
          <div className="animate-pulse text-gray-400">⏳ Processing...</div>
        ) : (
          <ReactMarkdown>{output || "Your AI result will appear here."}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}
