import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'LearnAI - Educational AI Tools',
  description: 'AI-powered learning tools: Flashcard Maker, Quiz Generator, and Study Buddy',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <header className="w-full p-4 shadow-md bg-blue-600 text-white sticky top-0 z-50">
          <h1 className="text-xl font-bold">LearnAI</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
