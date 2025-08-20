// components/CountryInfoPanel.tsx
"use client";

import React from "react";
import { Orbitron, Exo_2 } from "next/font/google";

// Fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["700"] });
const exo2 = Exo_2({ subsets: ["latin"], weight: ["400", "500"] });

type CountryInfo = {
  name: string;
  capital: string;   // ✅ added capital
  currency: string;
  flag: string;
} | null;

interface CountryInfoPanelProps {
  country: CountryInfo;
  mousePos?: { x: number; y: number };
  followMouse?: boolean; // if true → tooltip follows mouse
}

export default function CountryInfoPanel({
  country,
  mousePos,
  followMouse = false,
}: CountryInfoPanelProps) {
  if (!country) return null;

  // Tooltip position logic
  const style: React.CSSProperties =
    followMouse && mousePos
      ? {
          position: "absolute",
          top: mousePos.y + 20,
          left: mousePos.x + 20,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 50,
        }
      : {
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 50,
        };

  return (
    <div
      style={style}
      className="px-5 py-4 rounded-2xl border border-cyan-400/50 
                 bg-black/30 backdrop-blur-md text-white 
                 shadow-[0_0_20px_rgba(0,255,255,0.4)] flex flex-col 
                 items-center animate-fadeIn min-w-[160px]"
    >
      {/* Flag */}
      <div
        className={`text-3xl mb-2 animate-bounce-slow drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]`}
      >
        {country.flag}
      </div>

      {/* Country Name */}
      <div
        className={`${orbitron.className} font-bold text-lg tracking-wide text-center text-cyan-300 drop-shadow-[0_0_6px_rgba(0,255,255,0.8)]`}
      >
        {country.name}
      </div>

      {/* Capital */}
      <div
        className={`${exo2.className} text-sm text-pink-400 mt-1 text-center`}
      >
        Capital: {country.capital}
      </div>

      {/* Currency */}
      <div
        className={`${exo2.className} text-sm text-white/70 mt-1 text-center`}
      >
        Currency: {country.currency}
      </div>
    </div>
  );
}
