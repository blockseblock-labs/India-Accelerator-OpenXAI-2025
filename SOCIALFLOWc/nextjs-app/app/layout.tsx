import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'

// Load fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // you can choose weights
  variable: '--font-poppins',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

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
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="font-roboto bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
