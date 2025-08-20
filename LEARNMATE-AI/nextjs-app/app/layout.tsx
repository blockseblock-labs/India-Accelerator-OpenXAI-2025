import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LearnAI - Educational AI Tools',
  description: 'AI-powered learning tools: Flashcard Maker, Quiz Generator, and Study Buddy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 min-h-screen`}>
        {/* App Shell */}
        <header className="bg-white/10 backdrop-blur-sm shadow-md">
          <div className="container flex items-center justify-between py-4">
            <h1 className="text-xl font-bold text-white">📚 LearnAI</h1>
            <nav className="space-x-6 text-white/80 text-sm hidden md:flex">
              <a href="#flashcards" className="hover:text-white transition">Flashcards</a>
              <a href="#quiz" className="hover:text-white transition">Quiz</a>
              <a href="#study-buddy" className="hover:text-white transition">Study Buddy</a>
            </nav>
          </div>
        </header>

        <main className="container py-8">
          {children}
        </main>

        <footer className="bg-white/10 backdrop-blur-sm mt-12">
          <div className="container text-center py-6 text-white/70 text-sm">
            © {new Date().getFullYear()} LearnAI. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
