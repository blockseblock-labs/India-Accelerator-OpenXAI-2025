import "./chat.css";
// import "./globals.css";
import "./chat.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copilot Chat",
  description: "A Copilot-style chat app powered by Ollama",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e293b, #000)",
          color: "#f1f5f9",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </body>
    </html>
  );
}

