import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'LearnAI - Revolutionary Educational AI Tools',
  description: 'Transform your learning experience with AI-powered flashcard maker, intelligent quiz generator, and personalized study buddy. The future of education is here.',
  keywords: 'AI education, flashcards, quiz generator, study buddy, machine learning, personalized learning',
  authors: [{ name: 'LearnAI Team' }],
  creator: 'LearnAI',
  publisher: 'LearnAI',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
  openGraph: {
    title: 'LearnAI - Revolutionary Educational AI Tools',
    description: 'Transform your learning experience with AI-powered educational tools',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnAI - Revolutionary Educational AI Tools',
    description: 'Transform your learning experience with AI-powered educational tools',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="color-scheme" content="dark light" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} ${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}