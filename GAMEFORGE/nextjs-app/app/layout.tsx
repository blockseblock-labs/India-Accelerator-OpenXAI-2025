import type { Metadata } from 'next'
import { Inter, Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-rajdhani' })

export const metadata: Metadata = {
  title: 'GAMEFORGE',
  description: 'Forge your destiny, pixel by pixel. An epic adventure awaits!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable} ${rajdhani.variable}`}>{children}</body>
    </html>
  )
} 