import type { Metadata } from 'next'
import { Rajdhani } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani'
})

export const metadata: Metadata = {
  title: 'LEARNMATE.AI - Neural Network Learning System',
  description: 'Advanced AI-powered educational tools with retro cyberpunk interface: Flashcard Generator, Quiz Creator, and AI Study Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} font-rajdhani`}>{children}</body>
          </html>
    )
} 