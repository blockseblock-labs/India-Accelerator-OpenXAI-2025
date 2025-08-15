// app/page.tsx
import Globe from "@/components/Globe";
import { Orbitron, Exo_2 } from "next/font/google";

// Futuristic title font
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800"],
});

// Sleek subtitle font
const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Title */}
      <h1
        className={`${orbitron.className} text-4xl md:text-5xl font-extrabold mb-4 text-center text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]`}
      >
        🌍 Country Simulator
      </h1>

      {/* Subtitle */}
      <p
        className={`${exo2.className} text-lg md:text-xl text-gray-300 mb-12 text-center max-w-2xl leading-relaxed`}
      >
        Hover over the globe to explore country details — name, currency, and flag for India, USA, China, Russia, and Japan.
      </p>

      {/* Globe */}
      <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-cyan-500/20 shadow-cyan-500/40">
        <Globe />
      </div>
    </main>
  );
}
