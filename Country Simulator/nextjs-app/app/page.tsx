// app/page.tsx
import Globe from "@/components/Globe";
import CountryChat from "@/components/CountryChat";
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
    <main className="grid grid-rows-[auto_auto_1fr] h-screen w-screen p-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      
      {/* Title + Subtitle */}
      <div className="flex flex-col items-center text-center px-4">
        <h1
          className={`${orbitron.className} text-3xl md:text-5xl font-extrabold mb-3 text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]`}
        >
          🌍 Country Simulator
        </h1>
        <p
          className={`${exo2.className} text-sm md:text-lg text-gray-300 max-w-2xl leading-relaxed`}
        >
          Scroll and rotate the globe, then click on the country pins to learn
          about each nation — including its name, capital, currency, and flag.
          If you want to dive deeper, try chatting with the AI-powered Country
          Chatbot for more insights!
        </p>
      </div>

      {/* Guide */}
      <div className="flex justify-center mt-2">
        <div className="bg-black/60 border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-lg text-center text-xs md:text-sm leading-relaxed shadow-md">
          💡 Guide: Use your mouse or touch to scroll & rotate the globe. Click on
          the glowing pins to discover country details. For extra knowledge, ask
          the AI Country Chatbot!
        </div>
      </div>

      {/* Globe inside centered frame */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-3xl h-[60vh] rounded-xl overflow-hidden shadow-lg border border-cyan-500/20 shadow-cyan-500/40 flex items-center justify-center bg-black/40">
          {/* Center Globe here */}
          <div className="w-[90%] h-[90%] flex items-center justify-center">
            <Globe />
          </div>
        </div>
      </div>

      {/* Floating AI Chat (bottom-left, fixed) */}
      <div className="absolute bottom-4 left-4">
        <CountryChat />
      </div>
    </main>
  );
}
