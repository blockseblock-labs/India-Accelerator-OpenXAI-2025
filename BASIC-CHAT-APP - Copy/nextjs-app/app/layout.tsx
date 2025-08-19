import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en">
        <head />
        <body>
          <div className="app-root">
            <header className="site-header">
              <div className="site-header-inner">
                <div className="brand" aria-label={siteConfig.name}>
                  <div className="brand-badge" />
                  <span>{siteConfig.name}</span>
                </div>
              </div>
            </header>
            <main className="site-main">{children}</main>
          </div>
        </body>
      </html>
    </>
  );
}
