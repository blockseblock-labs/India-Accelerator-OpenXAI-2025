import VoiceRecorder from '@/components/voice-recorder'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Recorder */}
        <section className="flex flex-col items-center justify-center">
          <VoiceRecorder />
        </section>

        {/* Right: Features & Info */}
        <section className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-3xl p-8 shadow-2xl border border-white/10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Why SoundWave?
            </h2>
            <ul className="space-y-4 text-lg text-indigo-100 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                Real-time voice recording with enhanced audio quality
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                Modern playback controls and visual feedback
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                Ready for voice transcription and audio analysis
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                Beautiful, responsive design for any device
              </li>
            </ul>
          </div>
          <div className="bg-black/30 rounded-3xl p-8 shadow-xl border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Get Started</h3>
            <p className="text-indigo-200 mb-4">
              SoundWave is your launchpad for building next-gen audio apps. Record, play, and visualize audio effortlessly.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
              >
                Documentation
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}