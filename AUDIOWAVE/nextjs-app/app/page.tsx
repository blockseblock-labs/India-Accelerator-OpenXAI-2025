import VoiceRecorder from '@/components/voice-recorder'

export default function Home() {
  return (
    <>
      <div className="background-animation">
        <div className="bg-gradient"></div>
        <div className="grid-overlay"></div>
      </div>
      
      <main className="min-h-screen relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
              SoundWave Studio
            </h1>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              Experience the next generation of audio recording and processing
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left: Voice Recorder */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-glass p-8 rounded-3xl transform hover:scale-[1.02] transition-all duration-300">
                <VoiceRecorder />
              </div>
            </div>

            {/* Right: Features & Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-glass p-8 rounded-3xl hover:translate-x-2 transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Why SoundWave?
                </h2>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4 group">
                      <span className={`w-2 h-2 rounded-full ${feature.color} group-hover:scale-150 transition-transform`} />
                      <span className="text-indigo-100 group-hover:text-white transition-colors">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-glass p-8 rounded-3xl hover:translate-y-2 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  Get Started
                </h3>
                <p className="text-indigo-200 mb-6">
                  Join thousands of creators using SoundWave to build the future of audio.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="flex-1 btn-primary">
                    Documentation
                  </a>
                  <a href="#" className="flex-1 btn-secondary">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

const features = [
  { color: 'bg-green-400', text: 'Studio-quality voice recording' },
  { color: 'bg-blue-400', text: 'Real-time audio visualization' },
  { color: 'bg-purple-400', text: 'AI-powered noise reduction' },
  { color: 'bg-pink-400', text: 'Cross-platform compatibility' },
];