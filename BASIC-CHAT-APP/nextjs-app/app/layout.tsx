import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App",
  description: "Mini Task Chat App UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen`}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">
              💬 Chat App
            </h1>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}