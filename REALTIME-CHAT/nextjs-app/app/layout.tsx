import type { Metadata } from 'next';
import './globals.css';
import { Bot } from 'lucide-react'; // Import the icon

export const metadata: Metadata = {
  title: 'Interactive Realtime Chat',
  description: 'An AI chat application built with Next.js and Ollama',
};

// A new component for our top navigation bar
const TopNavbar = () => (
  <nav className="flex h-16 w-full items-center justify-center border-b bg-white shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white">
        <Bot size={18} />
      </div>
      <h1 className="text-xl font-semibold text-gray-800">
        Interactive Realtime Chat
      </h1>
    </div>
  </nav>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1/dist/geist-sans.css" />
      </head>
      <body className="font-sans">
        <div className="flex h-screen flex-col">
          <TopNavbar />
          {/* The rest of the page will be rendered here */}
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}