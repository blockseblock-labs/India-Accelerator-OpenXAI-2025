import VoiceRecorder from '@/components/voice-recorder'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#2c003e] to-[#004d40] p-12">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-16">
          <h1 className="text-6xl font-extrabold text-yellow-400 drop-shadow-md">
            🎵 SoundWave
          </h1>
          <p className="text-xl text-white/90 mt-4 max-w-2xl">
            A professional toolkit for audio recording, playback, transcription, and visualization. 
            Crafted for developers, creators, and innovators.
          </p>
        </header>
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Features on Left */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">✨ Premium Features</h2>
            <ul className="space-y-4 text-white/90">
              <li className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                <span>Crystal-clear audio recording</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                <span>Polished playback controls</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                <span>AI-powered transcription</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                <span>Luxury audio visualization</span>
              </li>
            </ul>
          </div>
          
          {/* Voice Recorder on Right */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-yellow-400/30 
          transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/40 hover:border-yellow-400">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">🎤 Try it now</h2>
            <VoiceRecorder />
          </div>
        </section>
        
        {/* Call to Action Banner */}
        <section className="mt-20">
      <div className="bg-white/10 backdrop-blur-md border border-yellow-400/30 text-white rounded-xl p-10 text-center shadow-lg 
      transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/40 hover:border-yellow-400">
        <h3 className="text-3xl font-extrabold mb-3 text-yellow-300 text-center">
           🚀 Elevate Your Audio Experience
        </h3>
        <p className="text-lg max-w-3xl mx-auto text-gray-200 text-center">
           Start building professional-grade audio apps with SoundWave. 
           Record, process, and visualize audio like never before.
        </p>
      </div>
        </section>
      </div>
    </main>
  )
}
