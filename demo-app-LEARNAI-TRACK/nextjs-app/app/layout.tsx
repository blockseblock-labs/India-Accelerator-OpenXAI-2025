// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenXAI • LEARNAI Demo',
  description: 'Hack Node India demo powered by Ollama',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {/* Top banner */}
        <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
            <span className="font-bold">OpenXAI • LEARNAI Track</span>
            <span className="opacity-90 text-sm">Hack Node India 2025 · llama3:8b</span>
          </div>
        </div>

        {/* Page container */}
        <main className="max-w-5xl mx-auto p-4">{children}</main>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto p-4 text-center text-xs text-gray-500">
          Built by Paresh • Powered by Ollama (llama3:8b)
        </footer>
      </body>
    </html>
  )
}
