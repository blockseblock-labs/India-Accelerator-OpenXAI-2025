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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* HEADER / NAVBAR */}
        <header className="bg-indigo-600 text-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wide">LearnAI</h1>
            <nav className="space-x-6">
              <a href="/" className="hover:text-gray-200">Home</a>
              <a href="/flashcards" className="hover:text-gray-200">Flashcards</a>
              <a href="/quiz" className="hover:text-gray-200">Quiz</a>
              <a href="/study-buddy" className="hover:text-gray-200">Study Buddy</a>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="container mx-auto px-6 py-10 min-h-screen">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
          <p>© {new Date().getFullYear()} LearnAI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
