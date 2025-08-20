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
        <header className="w-full bg-blue-600 text-white p-4 shadow-md">
          <h1 className="text-xl font-semibold">LearnAI</h1>
        </header>
        <main className="container mx-auto p-6">{children}</main>
        <footer className="w-full text-center text-sm text-gray-500 py-4 border-t">
          © {new Date().getFullYear()} LearnAI. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
