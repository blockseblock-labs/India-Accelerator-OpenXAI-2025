import VoiceRecorder from '@/components/voice-recorder'
import audioImg from "./assets/audio.png";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative flex flex-col lg:flex-row items-center lg:justify-between gap-8 mb-16">
          <div className="text-center lg:text-left text-white space-y-6">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight">
              USE YOUR AUDIO<span className="text-pink-400"></span>
            </h1>
            <p className="text-xl opacity-90">
              Build amazing audio experiences with real-time recording and AI-powered transcription.
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 transition px-6 py-3 rounded-full font-bold text-lg">
              Get Started
            </button>
          </div>

          <div className="relative w-full lg:w-1/2">
            <img 
                src={audioImg.src}  
              alt="Fitness Inspiration" 
              className="rounded-xl "
            />
          
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">Voice Recorder</h2>
            <VoiceRecorder />
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">Audio Features</h2>
            <div className="space-y-4 text-white">
              {[
                { color: 'green', text: 'Real-time audio recording' },
                { color: 'blue', text: 'Audio playback controls' },
                { color: 'purple', text: 'Voice transcription ready' },
                { color: 'pink', text: 'Audio visualization' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${feature.color}-400 rounded-full`}></div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-black/20 rounded-2xl p-12 backdrop-blur-sm shadow-xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to build your audio app?</h3>
            <p className="text-white/80 text-lg mb-6">
              This template includes everything you need to get started with audio processing, recording, and playback.
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 transition px-8 py-4 rounded-full font-bold text-lg">
              Start Now
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
