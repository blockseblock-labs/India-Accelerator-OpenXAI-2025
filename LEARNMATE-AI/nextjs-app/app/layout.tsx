import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LearnMate AI - Educational AI Tools',
  description: 'AI-powered learning tools: Flashcard Maker, Quiz Generator, and Study Buddy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        
        {/* ✅ Navbar */}
        <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
          <h1 className="text-2xl font-bold">LearnMate AI</h1>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:text-yellow-300 transition">Home</a></li>
            <li><a href="/flashcards" className="hover:text-yellow-300 transition">Flashcards</a></li>
            <li><a href="/quiz" className="hover:text-yellow-300 transition">Quiz</a></li>
            <li><a href="/study-buddy" className="hover:text-yellow-300 transition">Study Buddy</a></li>
          </ul>
        </nav>

        {/* ✅ Page Content */}
        <main className="min-h-[80vh] px-6 py-8">
          {children}
        </main>

        {/* ✅ Footer */}
        <footer className="text-center py-6 bg-gray-900 text-gray-300">
          <p>© {new Date().getFullYear()} LearnMate AI. All rights reserved.</p>
        </footer>

      </body>
    </html>
  )
}
