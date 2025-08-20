import './globals.css'

export const metadata = {
  title: 'LearnMate AI',
  description: 'Gen Z AI-powered learning assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="w-full max-w-xl mx-auto py-7 text-center shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">🚀 LearnMate AI</h1>
          <p className="text-lg mt-2 font-medium text-white drop-shadow">Flashcards for Gen Z Learners</p>
        </header>
        <main className="w-full max-w-xl mx-auto px-4 py-8 mt-6">
          {children}
        </main>
        <footer className="w-full max-w-xl mx-auto py-4 text-center text-xs text-white mt-8">
          <span className="opacity-80">&copy; {new Date().getFullYear()} LearnMate AI</span>
        </footer>
      </body>
    </html>
  )
}