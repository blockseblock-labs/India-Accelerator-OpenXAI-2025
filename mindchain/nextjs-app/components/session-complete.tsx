"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw } from "lucide-react";

interface SessionCompleteProps {
  onNewSession: () => void;
}

export function SessionComplete({ onNewSession }: SessionCompleteProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Session Complete
          </h1>
          <p className="text-xl text-green-600 dark:text-green-400 mb-4">
            🌿 You did it!
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Great job taking time for yourself. Regular breathing exercises can
            help reduce stress and improve your overall well-being.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onNewSession}
            size="lg"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Session
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Consider making this a daily habit for better mental health
          </div>
        </div>
      </div>
    </div>
  );
}
