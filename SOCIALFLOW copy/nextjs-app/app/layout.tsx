import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SocialFlow - AI-Powered Social Media Tools',
  description: 'Enhance your social media presence with our AI tools: Caption Generator, Mood Checker, and Hashtag Suggestor.',
  keywords: ['social media', 'AI tools', 'caption generator', 'mood checker', 'hashtag suggestor'],
  authors: [{ name: 'SocialFlow Team' }],
  creator: 'SocialFlow',
  publisher: 'SocialFlow',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SocialFlow - AI-Powered Social Media Tools',
    description: 'Enhance your social media presence with our AI tools.',
    url: '/',
    siteName: 'SocialFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialFlow - AI-Powered Social Media Tools',
    description: 'Enhance your social media presence with our AI tools.',
    creator: '@socialflow',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}