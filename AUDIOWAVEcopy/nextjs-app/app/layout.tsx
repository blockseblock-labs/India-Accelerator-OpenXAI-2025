import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex items-center justify-center p-6 relative`}
      >
        {/* Floating gradient blobs background */}
        <div className="hero-bg">
          <span></span>
          <span></span>
          <span></span>
        </div>
 
        <main className="glass-container w-full max-w-5xl p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
