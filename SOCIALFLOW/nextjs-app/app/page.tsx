'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
      
      <div className="relative z-10 text-center space-y-8 px-4">
        <h1 className="text-6xl font-bold text-white tracking-tight">
          Social<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Flow</span>
        </h1>
        
        <p className="text-xl text-white/90 max-w-xl mx-auto">
          Transform your social media presence with AI-powered captions, sentiment analysis, and trending hashtags.
        </p>
        
        <Link 
          href="/dashboard" 
          className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl
                    text-white font-semibold transition-all hover:scale-105 hover:bg-white/20
                    shadow-xl hover:shadow-2xl"
        >
          Launch App ✨
        </Link>
      </div>
    </div>
  )
}