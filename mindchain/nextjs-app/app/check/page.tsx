"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCw, Sparkles } from "lucide-react";
import { Confetti, ConfettiRef } from "@/components/magicui/confetti";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How have you been feeling emotionally over the past week?",
    options: ["Very good", "Good", "Neutral", "Not so good"],
  },
  {
    id: 2,
    text: "How would you rate your sleep quality?",
    options: ["Excellent", "Good", "Fair", "Poor"],
  },
  {
    id: 3,
    text: "How often have you felt stressed or anxious lately?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
  },
  {
    id: 4,
    text: "How would you rate your energy levels?",
    options: ["Very high", "High", "Moderate", "Low"],
  },
  {
    id: 5,
    text: "How connected do you feel with friends, family, or your community?",
    options: [
      "Very connected",
      "Somewhat connected",
      "Neutral",
      "Very isolated",
    ],
  },
  {
    id: 6,
    text: "How motivated have you felt to do daily tasks or activities?",
    options: [
      "Motivated",
      "Neutral",
      "Slightly unmotivated",
      "Not motivated at all",
    ],
  },
  {
    id: 7,
    text: "How often have you been able to relax or take breaks for yourself?",
    options: ["Daily", "A few times a week", "Once a week", "Rarely"],
  },
  {
    id: 8,
    text: "How would you rate your concentration or focus recently?",
    options: ["Excellent", "Good", "Average", "Poor"],
  },
  {
    id: 9,
    text: "How satisfied are you with your ability to manage your emotions?",
    options: [
      "Satisfied",
      "Neutral",
      "Somewhat dissatisfied",
      "Very dissatisfied",
    ],
  },
  {
    id: 10,
    text: "How often have you engaged in activities you enjoy (hobbies, exercise, reading, etc.)?",
    options: ["Very often", "Often", "Sometimes", "Rarely"],
  },
];

export default function CheckPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiRef>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setAiData(null);
    setAiError(null);
  };

  const calculateResult = () => {
    // Map answers to a severity score 0..3 (0 best, 3 worst)
    // Reverse scoring for negatively phrased questions (currently index 2: stress/anxiety)
    const reverseIndexes = new Set([2]);

    const severities = answers.map((answer, index) => {
      const options = questions[index]?.options ?? [];
      const pos = Math.max(0, options.indexOf(answer));
      const base = Math.min(Math.max(pos, 0), 3); // clamp 0..3
      return reverseIndexes.has(index) ? 3 - base : base;
    });

    const count = severities.length || 1;
    const avg = severities.reduce((a, b) => a + b, 0) / count; // 0..3

    if (avg <= 0.75) {
      return {
        status: "Excellent",
        message:
          "Your responses suggest you're doing well! Keep maintaining your healthy habits and positive mindset.",
        color: "text-green-600",
      } as const;
    } else if (avg <= 1.5) {
      return {
        status: "Good",
        message:
          "You're doing okay, but there might be some areas where you could use some self-care and attention.",
        color: "text-blue-600",
      } as const;
    } else if (avg <= 2.25) {
      return {
        status: "Fair",
        message:
          "Your responses indicate you might be experiencing some challenges. Consider talking to friends, family, or a counselor about how you're feeling.",
        color: "text-yellow-600",
      } as const;
    } else {
      return {
        status: "Concerning",
        message:
          "Your responses suggest you might be going through a difficult time. We strongly recommend reaching out to a mental health professional for support.",
        color: "text-red-600",
      } as const;
    }
  };

  // Compute result memoized for render
  const result = useMemo(
    () => (showResults ? calculateResult() : null),
    [showResults, answers]
  );

  // Trigger AI insights when results are shown the first time
  useEffect(() => {
    if (!showResults || aiData || loadingAI) return;
    const run = async () => {
      try {
        setLoadingAI(true);
        setAiError(null);
        const res = await fetch("/api/quiz-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            questions: questions.map((q) => q.text),
          }),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        // Ensure we store a string to display
        const text =
          typeof json === "string"
            ? json
            : json?.insights ?? JSON.stringify(json);
        setAiData(text);
      } catch (err: any) {
        setAiError(err?.message ?? "Something went wrong");
      } finally {
        setLoadingAI(false);
      }
    };
    run();
  }, [showResults]);

  // Fire confetti exactly when results are shown to the user
  useEffect(() => {
    if (!showResults) return;
    // Defer to ensure ref is attached after the results view mounts
    const id = requestAnimationFrame(() => {
      confettiRef.current?.fire?.({});
    });
    return () => cancelAnimationFrame(id);
  }, [showResults]);

  const riskColor =
    "from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30";

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
        />

        <h2 className="text-3xl font-bold mb-4">
          Mental Health Check-in Results
        </h2>

        <Button onClick={resetQuiz} variant={"outline"}>
          <RotateCw />
          Take Again
        </Button>

        <div
          className={`relative rounded-2xl border mt-6 mb-6 overflow-hidden bg-gradient-to-b ${riskColor}`}>
          <div className="p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3
                className="text-xl font-semibold text-transparent bg-clip-text
               bg-gradient-to-r from-white to-white/40
               [background-size:200%_200%] animate-[wave_3s_linear_infinite]">
                AI Insights
              </h3>
            </div>

            {loadingAI && (
              <p className="text-sm text-muted-foreground">
                Generating personalized insights…
              </p>
            )}
            {aiError && <p className="text-sm text-red-500">{aiError}</p>}
            {aiData && (
              <div className="space-y-4">
                <p className="leading-relaxed text-foreground/90">{aiData}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 p-4 border rounded-lg">
          {result && (
            <>
              <h3 className={`text-xl font-semibold mb-2 ${result.color}`}>
                Status: {result.status}
              </h3>
              <p className="mb-4">{result.message}</p>
            </>
          )}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Your responses:</h4>
            {questions.map((question, index) => (
              <div key={question.id} className="mb-2">
                <p className="font-medium">{question.text}</p>
                <p className="text-muted-foreground">
                  Your answer: {answers[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Mental Health Check-in</h1>
      <div className="mb-8">
        <h2 className="text-xl mb-4">{questions[currentQuestion].text}</h2>
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-3 border rounded hover:bg-accent transition-colors">
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}
