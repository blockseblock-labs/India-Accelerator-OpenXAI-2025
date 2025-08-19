import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic Chat App",
  description: "Simple chat interface",
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
          margin: 0,
          padding: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#f9fafb",
          color: "#111",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {/* Header */}
          <header
            style={{
              padding: "1rem",
              background: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            Basic Chat App
          </header>

          {/* Main content (chat area + input) */}
          <main
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              maxWidth: "800px",
              width: "100%",
              margin: "0 auto",
              padding: "1rem",
              overflow: "hidden",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
