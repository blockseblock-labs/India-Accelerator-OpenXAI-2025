"use client";

import { useEffect, useState } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "hold" | "exhale";
  progress: number;
  isActive: boolean;
}

export function BreathingCircle({
  phase,
  progress,
  isActive,
}: BreathingCircleProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isActive) {
      setScale(1);
      return;
    }

    switch (phase) {
      case "inhale":
        setScale(1 + (progress / 100) * 0.8);
        break;
      case "hold":
        setScale(1.8);
        break;
      case "exhale":
        setScale(1.8 - (progress / 100) * 0.8);
        break;
    }
  }, [phase, progress, isActive]);

  const getPhaseColors = () => {
    switch (phase) {
      case "inhale":
        return {
          from: "from-blue-400",
          to: "to-blue-600",
          shadow: "shadow-blue-400/50 dark:shadow-blue-400/30",
        };
      case "hold":
        return {
          from: "from-yellow-400",
          to: "to-orange-500",
          shadow: "shadow-yellow-400/50 dark:shadow-yellow-400/30",
        };
      case "exhale":
        return {
          from: "from-green-400",
          to: "to-emerald-600",
          shadow: "shadow-green-400/50 dark:shadow-green-400/30",
        };
    }
  };

  const colors = getPhaseColors();

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className={`absolute rounded-full bg-gradient-to-br ${colors.from} ${colors.to} opacity-20 dark:opacity-20 transition-all duration-1000 ease-in-out ${colors.shadow}`}
        style={{
          width: `${20 + scale * 8}rem`,
          height: `${20 + scale * 8}rem`,
          transform: `scale(${scale * 0.3})`,
          filter: "blur(20px)",
        }}
      />

      {/* Main circle */}
      <div
        className={`relative rounded-full bg-gradient-to-br ${colors.from} ${colors.to} transition-all duration-1000 ease-in-out shadow-2xl ${colors.shadow}`}
        style={{
          width: "16rem",
          height: "16rem",
          transform: `scale(${scale})`,
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/80 rounded-full shadow-lg" />
      </div>

      {/* Progress ring */}
      {isActive && (
        <svg className="absolute w-72 h-72 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-300 dark:text-white/20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-gray-700 dark:text-white transition-all duration-100"
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
            }}
          />
        </svg>
      )}
    </div>
  );
}
