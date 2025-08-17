
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "OpenXAI Portal",
//   description: "Enhanced UI with Next.js and Tailwind",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-indigo-50 via-white to-indigo-100 text-gray-800 min-h-screen flex flex-col`}
//       >
//         {/* Navbar */}
//         <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 shadow-md">
//           <div className="container mx-auto flex justify-between items-center px-6">
//             <h1 className="text-2xl font-bold tracking-wide">🚀 OpenXAI</h1>
//             <nav className="space-x-6">
//               <a href="#" className="hover:text-yellow-300 transition">
//                 Home
//               </a>
//               <a href="#" className="hover:text-yellow-300 transition">
//                 Features
//               </a>
//               <a href="#" className="hover:text-yellow-300 transition">
//                 Contact
//               </a>
//             </nav>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="flex-grow container mx-auto px-6 py-8">{children}</main>

//         {/* Footer */}
//         <footer className="bg-gray-800 text-gray-300 py-4 text-center text-sm">
//           © {new Date().getFullYear()} OpenXAI | Built with ❤️ using Next.js
//         </footer>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenXAI Portal",
  description: "AI-powered solutions made simple with Next.js and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-gray-900 min-h-screen flex flex-col`}
      >
        {/* Navbar */}
        <header className="w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white py-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center px-6">
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
              🤖 OpenXAI
            </h1>
            <nav className="space-x-6 font-medium">
              <a href="#" className="hover:text-yellow-300 transition">
                Home
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                Features
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                Docs
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                Contact
              </a>
            </nav>
            <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-300 transition">
              Get Started
            </button>
          </div>
        </header>

        {/* Hero / Main Content */}
        <main className="flex-grow container mx-auto px-6 py-12">
          <section className="text-center space-y-6">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to OpenXAI Portal
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore AI-powered tools, insights, and resources designed to
              supercharge your projects. Built with ❤️ using Next.js & Tailwind.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:scale-105 transition">
                Explore Features
              </button>
              <button className="px-6 py-3 rounded-xl bg-gray-200 text-gray-900 hover:bg-gray-300 shadow transition">
                Learn More
              </button>
            </div>
          </section>

          {/* Inject children (dynamic pages) */}
          <div className="mt-12">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} OpenXAI — Innovating with Artificial Intelligence
          </p>
          <p className="mt-2 text-gray-500">
            Built by Shreya using Next.js | Styled with 🎨 Tailwind
          </p>
        </footer>
      </body>
    </html>
  );
}
