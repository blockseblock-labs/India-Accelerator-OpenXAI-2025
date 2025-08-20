import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LearnAI - Educational AI Tools',
  description: 'AI-powered learning tools: Flashcard Maker, Quiz Generator, and Study Buddy',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'LearnAI - Educational AI Tools',
    description: 'Flashcard Maker, Quiz Generator, and Study Buddy with AI',
    url: 'https://yourdomain.com',
    siteName: 'LearnAI',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'LearnAI Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white transition-colors duration-500`}
      >
        {/* Main container */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  )
}
