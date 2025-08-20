import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindMate - AI-Powered Mental Wellness Companion',
  description: 'Your safe, AI-powered space for mental wellness. Chat, track moods, and get personalized mindfulness tips.',
  keywords: 'mental health, AI, wellness, mindfulness, mood tracking, mental wellness, hackathon',
  authors: [{ name: 'MindMate Team' }],
  openGraph: {
    title: 'MindMate - AI-Powered Mental Wellness Companion',
    description: 'Your safe, AI-powered space for mental wellness',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 