"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PetProps {
  mood: string;
}

// Simple progress bar
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function Pet({ mood }: PetProps) {
  const [hunger, setHunger] = useState(80);
  const [energy, setEnergy] = useState(90);
  const [happiness, setHappiness] = useState(70);

  // Slowly decrease stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((h) => Math.max(0, h - 1));
      setEnergy((e) => Math.max(0, e - 1));
      setHappiness((h) => Math.max(0, h - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pet Image */}
      <div className="w-40 h-40 relative">
        <Image
          src="/pet.png"
          alt="Your Pet"
          fill
          className="object-contain drop-shadow-xl"
        />
      </div>

      {/* Mood Text */}
      <p className="text-lg font-semibold text-gray-700">
        Your pet looks <span className="text-pink-600">{mood}</span> 🐾
      </p>

      {/* Levels */}
      <div className="w-64 space-y-3">
        <div>
          <p className="text-sm text-gray-600">🍖 Hunger</p>
          <ProgressBar value={hunger} />
        </div>
        <div>
          <p className="text-sm text-gray-600">⚡ Energy</p>
          <ProgressBar value={energy} />
        </div>
        <div>
          <p className="text-sm text-gray-600">😊 Happiness</p>
          <ProgressBar value={happiness} />
        </div>
      </div>
    </div>
  );
}
