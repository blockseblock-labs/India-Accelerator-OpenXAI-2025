"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

export function StreakTracker() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const currentStreak = Number.parseInt(
      localStorage.getItem("streak") || "0",
    );
    setStreak(currentStreak);
  }, []);

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
      <Flame className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
        {streak} day{streak !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
