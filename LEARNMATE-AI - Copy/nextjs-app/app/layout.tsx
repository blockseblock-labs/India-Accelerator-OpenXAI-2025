import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnAI - Educational AI Tools",
  description:
    "AI-powered learning tools: Flashcard Maker, Quiz Generator, and Study Buddy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white`}
      >
        <div className="p-4 flex justify-end">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
