import VoiceRecorder from '@/components/voice-recorder'

export default function Home() {
  return (
    <main>
      <div className="text-center text-white mb-12">
        <h1 className="text-6xl font-bold mb-4">🎵 SoundWave Template</h1>
        <p className="text-xl opacity-90">Build amazing audio experiences!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Recorder */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Voice Recorder</h2>
          <VoiceRecorder />
        </div>

        {/* Audio Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Audio Features</h2>
          <div className="space-y-4 text-white">
            <FeatureDot color="green" text="Real-time audio recording" />
            <FeatureDot color="blue" text="Audio playback controls" />
            <FeatureDot color="purple" text="Voice transcription ready" />
            <FeatureDot color="pink" text="Audio visualization" />
            <FeatureDot color="yellow" text="Save & share recordings" />
          </div>
        </div>
      </div>

      {/* Audio Library */}
      <div className="mt-12 bg-black/30 backdrop-blur-sm rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">📂 My Recordings</h3>
        <ul id="recordings-list" className="space-y-2 text-white/90">
          {/* Items will be dynamically added by VoiceRecorder */}
        </ul>
      </div>
    </main>
  )
}

function FeatureDot({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 bg-${color}-400 rounded-full`}></div>
      <span>{text}</span>
    </div>
  )
}
