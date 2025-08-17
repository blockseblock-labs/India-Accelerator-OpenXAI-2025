"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-green-600">AI Climate Simulator</h1>
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="#features">Features</Link>
        <Link href="#simulator">Simulator</Link>
        <Link href="#about">About</Link>
      </div>
    </nav>
  );
}
