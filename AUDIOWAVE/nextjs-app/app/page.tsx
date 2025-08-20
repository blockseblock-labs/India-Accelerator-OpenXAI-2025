import VoiceRecorder from '@/components/voice-recorder'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-700 via-sky-600 to-indigo-700 p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">🎵 SoundWave Studio</h1>
          <p className="text-xl opacity-90">Create, record & visualize sound like never before</p>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Voice Recorder Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">🎤 Voice Recorder</h2>
            <VoiceRecorder />
          </div>
          
          {/* Features Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">✨ Audio Features</h2>
            <div className="space-y-5 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Real-time audio recording</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
                <span>Custom audio playback controls</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
                <span>AI-ready voice transcription</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                <span>Beautiful audio visualizer</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl p-10 shadow-lg">
            <h3 className="text-3xl font-extrabold text-white mb-4">🚀 Ready to launch your audio app?</h3>
            <p className="text-white/90 text-lg">This template equips you with tools for audio recording, playback, visualization, and transcription to get started instantly.</p>
          </div>
        </div>
      </div>
    </main>
  )
}