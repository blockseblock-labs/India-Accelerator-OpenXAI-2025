import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnAI Template",
  description: "Flashcards, Quiz, and Study Buddy powered by Ollama (llama3.2:1b)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-grad-header text-white">
          <div className="mx-auto max-w-5xl px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">LearnAI</h1>
            <p className="mt-2 max-w-2xl text-white/90">
              Build flashcards, generate quizzes, and chat with a study buddy — all locally with Ollama.
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <footer className="border-t mt-16">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-gray-500">
            Made with Next.js 14 + Tailwind. Model: <code>llama3.2:1b</code> (Ollama).
          </div>
        </footer>
      </body>
    </html>
  );
}
