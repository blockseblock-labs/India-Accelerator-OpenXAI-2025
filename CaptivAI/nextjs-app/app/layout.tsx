import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InsightStream AI - Social Media Tools',
  description: 'Turning text streams into insights, Smart Caption AI ✍️s, and viral ideas 💡: Smart Caption AI ✍️ Generator, emotion Checker, and Hashtag Suggestor',
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