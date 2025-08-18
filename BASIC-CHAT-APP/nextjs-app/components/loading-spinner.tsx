"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="opacity-25"
        />
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          animate={{
            strokeDashoffset: 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
}
