import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'GameForge | Build & Share Games',
  description: 'A modern Next.js template to kickstart your game jam projects with speed and style.',
  authors: [{ name: 'GameForge Team' }],
  keywords: ['Game Jam', 'Next.js', 'Template', 'Game Development'],
  openGraph: {
    title: 'GameForge | Build & Share Games',
    description:
      'Kickstart your game jam projects using the GameForge template built with Next.js.',
    url: 'https://your-domain.com',
    siteName: 'GameForge',
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
