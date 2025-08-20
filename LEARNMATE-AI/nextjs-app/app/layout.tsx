// File: app/layout.js

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Roboto_Mono } from 'next/font/google' // Import the font
import './globals.css'

// Configure the font
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono', // Create a CSS variable
});

export const metadata: Metadata = {
  title: 'LearnMate AI',
  description: 'Your AI-Powered Learning Assistant',
};

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/* Apply the font class to the body */}
      <body className={robotoMono.className}>{children}</body>
    </html>
  );
}