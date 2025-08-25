"use client";

interface TimerProps {
  timeRemaining: number;
}

export function Timer({ timeRemaining }: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-mono font-bold text-gray-800 dark:text-white mb-2">
        {formatTime(timeRemaining)}
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        Time Remaining
      </p>
    </div>
  );
}
