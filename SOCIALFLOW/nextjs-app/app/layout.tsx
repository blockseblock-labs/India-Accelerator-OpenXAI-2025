import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'SocialFlow AI - AI-Powered Social Media Tools',
  description: 'Transform your social media presence with AI-powered tools: Caption Generator, Mood Checker, and Hashtag Suggestor. Perfect for Instagram, Twitter, TikTok, and more!',
  keywords: 'AI caption generator, social media tools, hashtag suggestor, mood checker, Instagram captions, social media AI',
  authors: [{ name: 'SocialFlow AI Team' }],
  creator: 'SocialFlow AI',
  publisher: 'SocialFlow AI',
  robots: 'index, follow',
  openGraph: {
    title: 'SocialFlow AI - AI-Powered Social Media Tools',
    description: 'Transform your social media presence with AI-powered tools for captions, mood analysis, and hashtag optimization.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SocialFlow AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialFlow AI - AI-Powered Social Media Tools',
    description: 'Transform your social media presence with AI-powered tools for captions, mood analysis, and hashtag optimization.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 