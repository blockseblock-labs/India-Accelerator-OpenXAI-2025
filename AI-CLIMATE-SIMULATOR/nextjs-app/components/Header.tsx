import { Brain } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                AI Climate Simulator
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="https://github.com/code63006/India-Accelerator-OpenXAI-2025" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                GitHub
              </a>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity duration-200">
                Start Simulation
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
