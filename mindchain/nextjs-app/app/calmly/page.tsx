"use client";

import { useState, useEffect, useRef } from "react";
import { BreathingCircle } from "@/components/breathing-circle";
import { Timer } from "@/components/timer";
import { PhaseIndicator } from "@/components/phase-indicator";
import { StreakTracker } from "@/components/streak-tracker";
import { SessionComplete } from "@/components/session-complete";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

type BreathingPhase = "inhale" | "hold" | "exhale";

const PHASE_DURATION = 4000;
const TOTAL_SESSION_TIME = 120;
const PHASES: BreathingPhase[] = ["inhale", "hold", "exhale"];

export default function CalmRoom() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(TOTAL_SESSION_TIME);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const phaseTimerRef = useRef<NodeJS.Timeout>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearAllTimers = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastSession = localStorage.getItem("lastSession");
    const currentStreak = Number.parseInt(
      localStorage.getItem("streak") || "0",
    );

    if (lastSession !== today) {
      localStorage.setItem("lastSession", today);
      localStorage.setItem("streak", (currentStreak + 1).toString());
    }
  };

  const startPhaseTimer = () => {
    setPhaseProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setPhaseProgress((prev) =>
        Math.min(prev + 100 / (PHASE_DURATION / 100), 100),
      );
    }, 100);

    phaseTimerRef.current = setTimeout(() => {
      setCurrentPhase((prev) => {
        const currentIndex = PHASES.indexOf(prev);
        return PHASES[(currentIndex + 1) % PHASES.length];
      });
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, PHASE_DURATION);
  };

  useEffect(() => {
    if (isActive && !isSessionComplete) {
      startPhaseTimer();

      sessionTimerRef.current = setInterval(() => {
        setSessionTime((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsSessionComplete(true);
            updateStreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearAllTimers;
  }, [isActive, currentPhase, isSessionComplete]);

  const handleStart = () => {
    setIsActive(true);
    setIsSessionComplete(false);
  };

  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setPhaseProgress(0);
    setSessionTime(TOTAL_SESSION_TIME);
    setIsSessionComplete(false);
  };

  const handleNewSession = () => {
    handleReset();
    handleStart();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isSessionComplete) {
    return <SessionComplete onNewSession={handleNewSession} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-1000">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            CalmRoom
          </h1>
          <StreakTracker />
        </div>

        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 backdrop-blur-sm"
        >
          {!mounted ? (
            <div className="w-4 h-4" />
          ) : theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 pb-8">
        <PhaseIndicator phase={currentPhase} isActive={isActive} />

        <div className="my-12">
          <BreathingCircle
            phase={currentPhase}
            progress={phaseProgress}
            isActive={isActive}
          />
        </div>

        <Timer timeRemaining={sessionTime} />

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          {!isActive ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 backdrop-blur-sm"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}

          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 backdrop-blur-sm"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Instructions */}
        {!isActive && sessionTime === TOTAL_SESSION_TIME && (
          <div className="mt-8 text-center max-w-md">
            <p className="text-gray-600 dark:text-white/80 leading-relaxed">
              Take a moment to relax. Follow the breathing pattern:
              <span className="font-semibold text-gray-800 dark:text-white">
                {" "}
                Inhale for 4 seconds, Hold for 4 seconds, Exhale for 4 seconds
              </span>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
