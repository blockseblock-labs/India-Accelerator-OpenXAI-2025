"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [time, setTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Timer logic
  useEffect(() => {
  if (!isRecording) return;

  const timer = setInterval(() => setTime((t) => t + 1), 1000);

  return () => clearInterval(timer);
  }, [isRecording]);
 
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-col items-center justify-center p-6">
      {/* Header */}
      <h1 className="text-5xl font-extrabold flex items-center gap-2 animate-pulse">
        🎵 SoundWave
      </h1>
      <p className="mt-2 text-lg opacity-80">Build amazing audio experiences!</p>

      {/* Recorder Section */}
      <div className="mt-10 bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">🎙️ Voice Recorder</h2>

        {/* Record + Play buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`relative px-6 py-3 rounded-full font-semibold transition transform ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
            {isRecording && (
              <>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full"></span>
              </>
            )}
          </button>

          <button className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 font-semibold">
            ▶️ Play Recording
          </button>
        </div>

        {/* Timer */}
        <p className="mt-4 text-lg font-mono">
          {isRecording ? formatTime(time) : "00:00"}
        </p>

        {/* Fake Audio Wave */}
        {isRecording && (
          <div className="flex justify-center gap-1 mt-6">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-green-400 rounded animate-bounce"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: `${10 + (i % 5) * 10}px`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mt-10 grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {[
          { icon: "🎙️", text: "Real-time Audio Recording" },
          { icon: "🎵", text: "Audio Playback Controls" },
          { icon: "📝", text: "Voice Transcription Ready" },
          { icon: "📊", text: "Audio Visualization" },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition transform text-center"
          >
            <p className="text-2xl">{f.icon}</p>
            <p className="mt-2 text-lg font-medium">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm opacity-70">
        Made with ❤️ by Sejal
      </footer>
    </main>
  );
}