"use client";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-grid text-center p-6 overflow-hidden">
      
      {/* Corner gradient accents (Blue tones) */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-900 via-indigo-800 to-transparent rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-blue-800 via-indigo-700 to-transparent rounded-full blur-3xl opacity-30"></div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-lg"
      >
        SoundWave Studio
      </motion.h1>

      <p className="mt-2 text-gray-400">
        Experience the next generation of audio recording and processing
      </p>

      {/* Main content */}
      <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        {/* Recorder Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="glass-card p-6 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition"
        >
          <h2 className="text-xl font-semibold text-white mb-4">🎤 Voice Recorder</h2>
          <p className="text-gray-400 mb-6">
            Record, play, and manage your voice notes with style.
          </p>
          <button className="btn-primary hover:scale-105 transition">Start Recording</button>
          <div className="mt-4 text-gray-300">0:00</div>
          <div className="audio-visualizer mt-4 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="audio-bar"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></span>
            ))}
          </div>
        </motion.div>

        {/* Why Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -5 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="glass-card p-6 rounded-2xl shadow-lg hover:shadow-blue-400/20 transition"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Why SoundWave?</h2>
          <ul className="text-gray-300 space-y-2 text-left">
            <li>🎙️ High-fidelity studio-grade voice capture</li>
            <li>📊 Real-time waveform and audio visualization</li>
            <li>🤖 Intelligent AI-driven noise suppression</li>
            <li>💻 Seamless compatibility across all major platforms</li>
          </ul>
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-12 flex gap-4">
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:opacity-90 transition">
          Get Started
        </button>
        <button className="px-6 py-3 rounded-xl border border-blue-400 text-blue-300 font-semibold hover:bg-blue-400/10 transition">
          Learn More
        </button>
      </div>
    </main>
  );
}
