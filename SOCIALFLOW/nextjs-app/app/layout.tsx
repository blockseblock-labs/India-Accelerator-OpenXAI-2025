import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
} 