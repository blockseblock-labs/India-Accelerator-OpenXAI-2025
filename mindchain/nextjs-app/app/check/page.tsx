"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

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
  const [aiData, setAiData] = useState<{
    summary: string;
    moodScore: number;
    riskLevel: "low" | "moderate" | "high";
    suggestions: string[];
  } | null>(null);

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
    let score = 0;
    answers.forEach((answer, index) => {
      const options = questions[index].options;
      // Calculate score based on answer position (reverse for negative questions)
      if (index === 2) {
        // For stress/anxiety question, reverse scoring
        score += 4 - options.indexOf(answer);
      } else {
        score += options.indexOf(answer);
      }
    });

    // Maximum possible score is 16 (4 questions × 4 points)
    if (score <= 4) {
      return {
        status: "Excellent",
        message:
          "Your responses suggest you're doing well! Keep maintaining your healthy habits and positive mindset.",
        color: "text-green-600",
      };
    } else if (score <= 8) {
      return {
        status: "Good",
        message:
          "You're doing okay, but there might be some areas where you could use some self-care and attention.",
        color: "text-blue-600",
      };
    } else if (score <= 12) {
      return {
        status: "Fair",
        message:
          "Your responses indicate you might be experiencing some challenges. Consider talking to friends, family, or a counselor about how you're feeling.",
        color: "text-yellow-600",
      };
    } else {
      return {
        status: "Concerning",
        message:
          "Your responses suggest you might be going through a difficult time. We strongly recommend reaching out to a mental health professional for support.",
        color: "text-red-600",
      };
    }
  };

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
        const data = json.object ?? json; // ai SDK returns {object}
        setAiData(data);
        // celebratory confetti
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err: any) {
        setAiError(err?.message ?? "Something went wrong");
      } finally {
        setLoadingAI(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  const riskColor = useMemo(() => {
    switch (aiData?.riskLevel) {
      case "high":
        return "from-red-500/20 via-red-500/10 to-transparent border-red-500/30";
      case "moderate":
        return "from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30";
      default:
        return "from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/30";
    }
  }, [aiData?.riskLevel]);

  if (showResults) {
    const result = calculateResult();
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          Mental Health Check-in Results
        </h2>
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className={`text-xl font-semibold mb-2 ${result.color}`}>
            Status: {result.status}
          </h3>
          <p className="mb-4">{result.message}</p>
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
          <div className="bg-primary-foreground p-4 rounded-lg mt-4">
            <p className="text-sm text-primary">
              <strong>Important Note:</strong> This assessment is not a
              diagnostic tool. If you're experiencing persistent mental health
              concerns, please reach out to:
            </p>
            <ul className="list-disc ml-6 mt-2 text-sm text-muted-foreground">
              <li>Your local mental health professional</li>
              <li>National Crisis Hotline: 988</li>
              <li>Your primary care physician</li>
            </ul>
          </div>
        </div>

        {/* AI Insights Card */}
        <div
          className={`relative rounded-2xl border mb-6 overflow-hidden bg-gradient-to-b ${riskColor}`}>
          <div className="p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">AI Insights</h3>
            </div>
            {loadingAI && (
              <p className="text-sm text-muted-foreground">
                Generating personalized insights…
              </p>
            )}
            {aiError && <p className="text-sm text-red-500">{aiError}</p>}
            {aiData && (
              <div className="space-y-4">
                <p className="leading-relaxed text-foreground/90">
                  {aiData.summary}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Mood score:</span>{" "}
                    <span>{Math.round(aiData.moodScore)} / 100</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Risk:</span>{" "}
                    <span className="capitalize">{aiData.riskLevel}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Try this week:</h4>
                  <ul className="list-disc ml-5 space-y-1">
                    {aiData.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-foreground/90">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {/* Confetti hint gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/5 dark:to-white/10" />
        </div>
        <Button onClick={resetQuiz} variant={"outline"}>
          Take Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mental Health Check-in</h1>
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
