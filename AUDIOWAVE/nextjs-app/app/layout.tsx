// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'SoundWave Template',
//   description: 'A template for building amazing audio experiences',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// } 

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { useState, createContext, useContext, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

// Theme context for dark/light mode
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export const metadata: Metadata = {
  title: 'SoundWave Template',
  description: 'A template for building amazing audio experiences',
  icons: {
    icon: '/favicon.ico', // make sure to add favicon in public folder
  },
  openGraph: {
    title: 'SoundWave Template',
    description: 'A template for building amazing audio experiences',
    url: 'https://yourwebsite.com',
    siteName: 'SoundWave',
    images: [
      {
        url: 'https://yourwebsite.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <html lang="en">
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <body className={`${inter.className} transition-colors duration-300`}>
          {/* Example: Dark mode toggle button */}
          <button
            onClick={toggleTheme}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px 20px',
              background: '#000',
              color: '#fff',
              borderRadius: '5px',
              zIndex: 1000,
            }}
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'}
          </button>

          {children}
        </body>
      </ThemeContext.Provider>
    </html>
  )
}
