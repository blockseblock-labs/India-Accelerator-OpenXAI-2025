import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./InterVariable.ttf",
});

export const metadata: Metadata = {
  title: "Dead-Earth Project - Climate Change Simulation",
  description:
    "Interactive 3D globe simulation showing the devastating effects of pollution and climate change on our planet.",
  keywords:
    "climate change, environment, pollution, simulation, 3D globe, education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">{children}</div>
      </body>
    </html>
  );
}
