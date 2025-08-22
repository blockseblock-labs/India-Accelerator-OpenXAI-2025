"use client";
import { Dispatch, SetStateAction } from "react";

interface ModeSelectorProps {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  loading: boolean;
}

export default function ModeSelector({ mode, setMode, onAnalyze, loading }: ModeSelectorProps) {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={() => { setMode("comment"); onAnalyze(); }}
        disabled={loading}
        className={`px-5 py-2 rounded-lg text-white font-medium transition ${
          mode === "comment"
            ? "bg-blue-600"
            : "bg-blue-500 hover:bg-blue-600"
        } ${loading && "opacity-60 cursor-not-allowed"}`}
      >
        {loading && mode === "comment" ? "Commenting..." : "💬 Add Comments"}
      </button>

      <button
        onClick={() => { setMode("explain"); onAnalyze(); }}
        disabled={loading}
        className={`px-5 py-2 rounded-lg text-white font-medium transition ${
          mode === "explain"
            ? "bg-green-600"
            : "bg-green-500 hover:bg-green-600"
        } ${loading && "opacity-60 cursor-not-allowed"}`}
      >
        {loading && mode === "explain" ? "Explaining..." : "📖 Explain Code"}
      </button>
    </div>
  );
}
