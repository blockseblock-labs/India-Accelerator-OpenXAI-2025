import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'SocialFlow',
  description: 'AI-powered social media tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-darkblue via-black to-black text-white">
        <header className="w-full py-4 bg-darkblue shadow-lg">
          <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold text-white">SocialFlow</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-accent">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-accent">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="w-full py-4 bg-black text-center text-sm text-gray-400">
          © 2025 SocialFlow. All rights reserved.
        </footer>
      </body>
    </html>
  );
}