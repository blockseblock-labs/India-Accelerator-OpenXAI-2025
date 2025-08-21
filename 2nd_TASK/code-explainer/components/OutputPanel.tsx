// components/OutputPanel.tsx
"use client";
import { useState } from "react";

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

  return (
    <div className="mt-6 bg-white border rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">AI Output</h2>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
<pre className="bg-gray-950/80 text-green-300 p-4 rounded-xl h-80 overflow-auto whitespace-pre-wrap text-sm border border-gray-700 shadow-inner">
  {loading ? "⏳ Processing..." : output || "Your AI result will appear here."}
</pre>

    </div>
  );
}
