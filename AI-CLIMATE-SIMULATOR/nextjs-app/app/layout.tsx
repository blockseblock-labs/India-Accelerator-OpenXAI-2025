// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";

// const inter = localFont({
//   src: "./InterVariable.ttf",
// });

// export const metadata: Metadata = {
//   title: "Dead-Earth Project - Climate Change Simulation",
//   description:
//     "Interactive 3D globe simulation showing the devastating effects of pollution and climate change on our planet.",
//   keywords:
//     "climate change, environment, pollution, simulation, 3D globe, education",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <div className="min-h-screen bg-black text-white">{children}</div>
//       </body>
//     </html>
//   );
// }


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
  authors: [{ name: "Your Name", url: "https://your-portfolio.com" }],
  openGraph: {
    title: "Dead-Earth Project 🌍",
    description:
      "A 3D interactive globe simulation showing how pollution & climate change impact Earth.",
    url: "https://your-site.com",
    siteName: "Dead-Earth Project",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Dead-Earth Globe Simulation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white flex flex-col">
          {/* Header */}
          <header className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">🌍 Dead-Earth Project</h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto p-6">{children}</main>

          {/* Footer */}
          <footer className="p-4 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} Dead-Earth Project. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
