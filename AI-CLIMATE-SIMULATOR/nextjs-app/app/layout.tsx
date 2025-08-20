import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./InterVariable.ttf",
});

export const metadata: Metadata = {
  title: "Dead-Earth Project - Advanced Climate Simulation",
  description:
    "Professional-grade interactive 3D climate change simulation with real-time environmental impact analysis and AI-powered predictions.",
  keywords:
    "climate change, environment, pollution, simulation, 3D globe, AI analysis, professional, real-time monitoring",
  openGraph: {
    title: "Dead-Earth Project - Climate Simulation",
    description: "Advanced environmental impact simulator with AI analysis",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-black text-white overflow-hidden">
          {children}
        </div>
        
        {/* Preload critical resources */}
        <link rel="prefetch" href="/api/process-command" />
        
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
        </div>
      </body>
    </html>
  );
}