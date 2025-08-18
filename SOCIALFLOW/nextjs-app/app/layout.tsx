import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"  // 👈 import your sidebar
import { SidebarProvider } from "@/components/ui/sidebar" // 👈 make sure to wrap with provider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Network AI - Social Media Tools",
  description:
    "AI-powered social media tools: Caption Generator, Mood Checker, and Hashtag Suggestor",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 👇 Provide Sidebar context */}
        <SidebarProvider>
          <div className="flex h-screen">
            {/* Sidebar on the left */}
            <AppSidebar />
            {/* Page content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
