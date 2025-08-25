"use client";

interface PhaseIndicatorProps {
  phase: "inhale" | "hold" | "exhale";
  isActive: boolean;
}

export function PhaseIndicator({ phase, isActive }: PhaseIndicatorProps) {
  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "text-blue-600 dark:text-blue-400";
      case "hold":
        return "text-yellow-600 dark:text-yellow-400";
      case "exhale":
        return "text-green-600 dark:text-green-400";
    }
  };

  return (
    <div className="text-center">
      <h2
        className={`text-3xl sm:text-4xl font-bold transition-all duration-500 ${getPhaseColor()} ${
          isActive ? "animate-pulse" : ""
        }`}
      >
        {getPhaseText()}
      </h2>
      {isActive && (
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
          {phase === "inhale" && "Fill your lungs slowly"}
          {phase === "hold" && "Keep the air in your lungs"}
          {phase === "exhale" && "Release the air slowly"}
        </p>
      )}
    </div>
  );
}
