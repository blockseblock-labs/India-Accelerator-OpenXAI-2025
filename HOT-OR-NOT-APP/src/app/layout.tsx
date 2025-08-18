import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hot or Not App",
  description: "Vote and discover what’s trending!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[var(--accent)]">🔥 Hot or Not</h1>
            <nav className="space-x-6">
              <a href="/" className="text-[var(--accent)] hover:underline">Home</a>
              <a href="/about" className="text-[var(--accent)] hover:underline">About</a>
              <a href="/contact" className="text-[var(--accent)] hover:underline">Contact</a>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}

          {/* Example Blue Button */}
          <button className="mt-6 bg-[var(--accent)] text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition">
            Vote Now
          </button>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 mt-10 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hot or Not. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
