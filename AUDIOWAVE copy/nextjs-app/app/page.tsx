"use client"

import { motion } from "framer-motion"
import VoiceRecorder from "@/components/voice-recorder"
import { Mic, PlayCircle, FileText, Activity } from "lucide-react"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 p-8 overflow-hidden">
      {/* Floating gradient orbs in background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3, y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3, y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-16"
        >
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight">
            🎵 SoundWave Template
          </h1>
          <p className="text-xl opacity-90">Build amazing audio experiences!</p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Voice Recorder Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Mic className="w-6 h-6 text-pink-400" /> Voice Recorder
            </h2>
            <VoiceRecorder />
          </motion.div>

          {/* Features Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Audio Features</h2>
            <div className="space-y-5 text-white">
              <FeatureItem icon={<Mic className="text-green-400" />} text="Real-time audio recording" />
              <FeatureItem icon={<PlayCircle className="text-blue-400" />} text="Audio playback controls" />
              <FeatureItem icon={<FileText className="text-purple-400" />} text="Voice transcription ready" />
              <FeatureItem icon={<Activity className="text-pink-400" />} text="Audio visualization" />
            </div>
          </motion.div>
        </div>

        {/* Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-black/30 rounded-2xl p-10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">🚀 Ready to build your audio app?</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              This template includes everything you need to get started with audio processing, recording, and playback.
              Add AI transcription, real-time streaming, or audio effects to make it your own.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full">
        {icon}
      </div>
      <span className="text-lg">{text}</span>
    </motion.div>
  )
}
