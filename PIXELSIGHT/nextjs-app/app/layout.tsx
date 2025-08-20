import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Make sure the Sidebar component exists at this path, or update the path if necessary
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { ToastProvider } from "./components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixelSight - AI Image Analysis Platform",
  description: "Advanced AI-powered image analysis with comprehensive insights and reporting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
