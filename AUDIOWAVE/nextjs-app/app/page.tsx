import VoiceRecorder from '@/components/voice-recorder'

export default function Home() {
  return (
<main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-600 p-8">
  <div className="max-w-5xl mx-auto">
    <div className="text-center text-white mb-16">
      <h1 className="text-6xl font-extrabold drop-shadow-lg">🎵 SoundWave Template</h1>
      <p className="text-xl opacity-90 mt-2">Build amazing audio experiences!</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl hover:scale-[1.02] transition-transform">
        <h2 className="text-2xl font-bold text-white mb-6">🎙 Voice Recorder</h2>
        <VoiceRecorder />
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl hover:scale-[1.02] transition-transform">
        <h2 className="text-2xl font-bold text-white mb-6">✨ Audio Features</h2>
        <div className="space-y-4 text-white/90 text-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Real-time audio recording</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Audio playback controls</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>Voice transcription ready</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span>Audio visualization</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-16 text-center">
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-10 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-4">🚀 Ready to build your audio app?</h3>
        <p className="text-white/80 max-w-xl mx-auto">
          This template includes everything you need to get started with audio processing, recording, and playback.
        </p>
      </div>
    </div>
  </div>
</main>

  )
} 