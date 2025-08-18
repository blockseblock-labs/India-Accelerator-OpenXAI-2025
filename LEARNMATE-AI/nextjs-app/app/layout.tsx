import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LearnMate AI",
  description: "Flashcards, quizzes, and study buddy powered by AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-gray-900`}>
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow">
                LM
              </span>
              <span className="text-xl font-bold">LearnMate AI</span>
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <Link href="/?view=flashcards" className="nav-link">Flashcards</Link>
              <Link href="/?view=quiz" className="nav-link">Quiz</Link>
              <Link href="/?view=study-buddy" className="nav-link">Study Buddy</Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/?view=study-buddy"
                className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </header>

        <main className="min-h-[80vh]">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t">
          <div className="max-w-6xl mx-auto px-5 py-10 grid sm:grid-cols-3 gap-8 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800">LearnMate AI</h3>
              <p className="mt-2">AI-powered flashcards, quizzes, and a study buddy to help you learn faster.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Quick Links</h4>
              <ul className="mt-2 space-y-2">
                <li><Link href="/?view=quiz" className="hover:text-indigo-600">Quiz</Link></li>
                <li><Link href="/?view=flashcards" className="hover:text-indigo-600">Flashcards</Link></li>
                <li><Link href="/?view=study-buddy" className="hover:text-indigo-600">Study Buddy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Note</h4>
              <p className="mt-2">This whole project is designed by Rajan Pandey during internship at BlockseBlock.</p>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 pb-8">
            © {new Date().getFullYear()} LearnMate AI
          </div>
        </footer>
      </body>
    </html>
  )
}
