import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Social Network AI - Social Media Tools',
  description: 'AI-powered social media tools: Caption Generator, Mood Checker, and Hashtag Suggestor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-300`}>{children}</body>
    </html>
  )
}