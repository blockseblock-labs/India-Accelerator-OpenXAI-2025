import { Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              AI Climate Simulator
            </h3>
            <p className="text-slate-400 text-sm">
              An interactive simulation exploring climate change impacts and solutions through AI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/code63006/India-Accelerator-OpenXAI-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-all duration-200"
              >
                <Github size={20} />
              </a>
              <a 
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-all duration-200"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-all duration-200"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} AI Climate Simulator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
