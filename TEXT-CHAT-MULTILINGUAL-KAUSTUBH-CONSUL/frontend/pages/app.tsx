// frontend/pages/_app.tsx
import type { AppProps } from 'next/app'
import '../styles/globals.css'  // Import your global CSS here

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
