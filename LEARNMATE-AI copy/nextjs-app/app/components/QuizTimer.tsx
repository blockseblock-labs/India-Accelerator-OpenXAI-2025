"use client"
import { useEffect, useState } from "react"

interface QuizTimerProps {
  duration: number
  onTimeUp: (finalScore: number) => void
  score: number
}

export default function QuizTimer({ duration, onTimeUp, score }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      const timeBonus = Math.max(0, Math.floor((timeLeft / duration) * 20))
      onTimeUp(score + timeBonus)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp, score, duration])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center justify-center bg-gray-900 text-white font-bold rounded-xl px-4 py-2 shadow-lg">
      ⏱ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  )
}
