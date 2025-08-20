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
      <body className={inter.className + " bg-gray-50 text-gray-900"}>
  {/* Header */}
  <header className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center shadow-md">
    <h1 className="text-2xl font-bold">🚀 Learning App</h1>
  </header>

  {children}
</body>

    </html>
  )
} 