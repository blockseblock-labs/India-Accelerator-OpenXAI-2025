import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";

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
    <html lang="en">
      <head />
      <body
        style={{
          margin: 0,
          fontFamily: "Poppins, sans-serif",
          background: "linear-gradient(to right, #667eea, #764ba2)",
          color: "white",
        }}
      >
        {/* ✅ Navbar */}
        <nav
          style={{
            background: "#222",
            padding: "15px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>{siteConfig.name}</h2>
          <div>
            <a href="/" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>Home</a>
            <a href="/about" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>About</a>
            <a href="/contact" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>Contact</a>
          </div>
        </nav>

        {/* ✅ Main content */}
        <main style={{ minHeight: "80vh", padding: "40px" }}>{children}</main>

        {/* ✅ Footer */}
        <footer
          style={{
            background: "#111",
            padding: "20px",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
