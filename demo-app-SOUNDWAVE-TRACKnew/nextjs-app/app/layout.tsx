import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SoundWave Template',
  description: 'A template for building amazing audio experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-indigo-600 to-purple-600 min-h-screen transition-colors`}
      >
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  )
}
