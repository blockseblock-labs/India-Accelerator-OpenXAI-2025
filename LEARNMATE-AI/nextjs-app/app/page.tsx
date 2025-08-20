"use client";

import { useState } from "react";

interface Flashcard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function LearnAI() {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [loading, setLoading] = useState(false);

  // Flashcard states
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Quiz states
  const [quizText, setQuizText] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Study Buddy states
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);

  // ---------- Local "mock" generators so UI works without Ollama ----------
  const generateFlashcards = async () => {
    if (!notes.trim()) return;
    setLoading(true);

    // Simple local flashcard generator:
    // split by double newline into paragraphs; if single line split by sentences.
    const paragraphs = notes
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    const cards: Flashcard[] = [];

    if (paragraphs.length) {
      paragraphs.forEach((p) => {
        const sentences = p.split(/[.?!]\s+/).map((s) => s.trim()).filter(Boolean);
        const front = sentences[0] ?? p;
        const back = sentences.slice(1).join(". ") || "Explanation: " + p;
        cards.push({ front, back: back.endsWith(".") ? back : back + (back ? "." : "") });
      });
    } else {
      const lines = notes.split(/\n/).map((l) => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i += 2) {
        const front = lines[i];
        const back = lines[i + 1] ?? "Definition not available (mock result)";
        cards.push({ front, back });
      }
    }

    // Fallback minimal card if nothing parsed
    if (cards.length === 0) {
      cards.push({ front: notes.slice(0, 60), back: notes });
    }

    // small delay to emulate processing
    await new Promise((r) => setTimeout(r, 600));
    setFlashcards(cards);
    setCurrentCard(0);
    setFlipped(false);
    setLoading(false);
  };

  const generateQuiz = async () => {
    if (!quizText.trim()) return;
    setLoading(true);

    // Make very simple quiz from sentences: use first 3 flashcard-like fronts as "terms"
    const sentences = quizText
      .split(/[.?!]\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const items = sentences.slice(0, 6);
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < Math.min(3, items.length); i++) {
      const questionText = `Which option best matches: "${items[i].slice(0, 40)}..."?`;
      const correct = 0;
      const options = [
        items[i] || "Correct (mock)",
        items[(i + 1) % items.length] || "Option 2",
        items[(i + 2) % items.length] || "Option 3",
      ];
      const explanation = items[i] || "Explanation not available (mock).";
      questions.push({ question: questionText, options, correct, explanation });
    }

    // fallback: single sample question
    if (questions.length === 0) {
      questions.push({
        question: "What is this text mainly about? (mock)",
        options: ["Topic A", "Topic B", "Topic C"],
        correct: 1,
        explanation: "This is a mock explanation.",
      });
    }

    await new Promise((r) => setTimeout(r, 600));
    setQuiz(questions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResults(false);
    setScore(0);
    setLoading(false);
  };

  const askStudyBuddy = async () => {
    if (!question.trim()) return;
    setLoading(true);

    // local mock answer that is helpful and safe.
    const mockAnswer =
      "I can't access an LLM from your PC right now — here's a quick study-tip answer: " +
      (question.length > 120 ? question.slice(0, 120) + "..." : question) +
      " — try breaking the problem into smaller parts, make examples, and test them.";

    // simulate delay
    await new Promise((r) => setTimeout(r, 800));
    const newChat = { question, answer: mockAnswer };
    setChatHistory((prev) => [...prev, newChat]);
    setQuestion("");
    setLoading(false);
  };

  // ---------- UI helpers ----------
  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };
  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    if (!quiz.length) return;
    setSelectedAnswer(answerIndex);

    if (answerIndex === quiz[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 900);
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-learn-gradient py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">📚 LearnMate AI</h1>
          <p className="text-white/90 mt-2">Your AI study assistant — (mocked locally for UI)</p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex space-x-2">
            {[
              { id: "flashcards", label: "🃏 Study Cards", desc: "Create quick cards" },
              { id: "quiz", label: "📝 Knowledge Quiz", desc: "Test yourself" },
              { id: "study-buddy", label: "🤖 AI Tutor", desc: "Ask a question" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-lg transition-all text-sm md:text-base ${
                  activeTab === tab.id
                    ? "bg-white text-purple-700 shadow-lg font-medium"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-xs opacity-80">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="bg-white/5 rounded-2xl p-6 md:p-8">
          {/* FLASHCARDS */}
          {activeTab === "flashcards" && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🃏 Study Card Maker</h2>

              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your notes (paragraphs or lines). Example: Term — Explanation, or paragraph describing a concept."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/20"
                  />
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60"
                    >
                      {loading ? "Generating..." : "Create Study Cards (mock)"}
                    </button>
                    <button
                      onClick={() => {
                        // quick sample fill
                        setNotes(
                          "Photosynthesis\nPlants convert sunlight into chemical energy.\n\nMitosis\nCell division that results in two daughter cells."
                        );
                      }}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg"
                    >
                      Fill sample
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 text-white">
                    Card {currentCard + 1} of {flashcards.length}
                  </div>

                  <div
                    className={`flashcard mx-auto mb-6 cursor-pointer`}
                    onClick={() => setFlipped(!flipped)}
                    role="button"
                    aria-label="Toggle flashcard"
                  >
                    <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
                      <div className="flashcard-front p-6">
                        <p className="text-lg md:text-xl font-semibold text-white">
                          {flashcards[currentCard]?.front}
                        </p>
                      </div>
                      <div className="flashcard-back p-6">
                        <p className="text-lg md:text-xl text-white">
                          {flashcards[currentCard]?.back}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setFlashcards([]);
                          setNotes("");
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        New Cards
                      </button>
                      <button
                        onClick={() => {
                          // export as simple JSON file
                          const data = JSON.stringify(flashcards, null, 2);
                          const blob = new Blob([data], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "flashcards.json";
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg"
                      >
                        Export
                      </button>
                    </div>

                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* QUIZ */}
          {activeTab === "quiz" && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📝 Knowledge Quiz</h2>

              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text to generate a short quiz (mock). Example: paste a paragraph or notes."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/20"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-60"
                    >
                      {loading ? "Creating..." : "Create Quiz (mock)"}
                    </button>
                    <button
                      onClick={() =>
                        setQuizText(
                          "Photosynthesis is the process by which plants use sunlight to synthesize foods from carbon dioxide and water. Mitosis is the process of cell division in eukaryotic cells."
                        )
                      }
                      className="px-4 py-2 bg-white/10 text-white rounded-lg"
                    >
                      Fill sample
                    </button>
                  </div>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
                  <p className="text-xl text-white mb-6">
                    You scored {score} out of {quiz.length} (
                    {Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setQuiz([]);
                        setShowResults(false);
                        setScore(0);
                      }}
                      className="px-5 py-3 bg-indigo-600 text-white rounded-lg"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setQuiz([]);
                        setQuizText("");
                        setShowResults(false);
                        setScore(0);
                      }}
                      className="px-5 py-3 bg-white/10 text-white rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 text-white">
                    Question {currentQuestion + 1} of {quiz.length}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {quiz[currentQuestion]?.question}
                    </h3>

                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options.map((option, index) => {
                        const stateClass =
                          selectedAnswer === null
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : selectedAnswer === index
                            ? index === quiz[currentQuestion].correct
                              ? "correct"
                              : "incorrect"
                            : index === quiz[currentQuestion].correct
                            ? "correct"
                            : "bg-white/10 text-white/50";

                        return (
                          <button
                            key={index}
                            onClick={() => selectAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 rounded-lg transition-all quiz-option ${stateClass}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswer !== null && (
                      <div className="mt-4 p-4 bg-white/10 rounded-lg text-white">
                        <p className="font-medium">Explanation:</p>
                        <p className="mt-2">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STUDY BUDDY */}
          {activeTab === "study-buddy" && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🤖 AI Tutor (mock)</h2>

              <div className="mb-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a study question (e.g., 'Explain Newton's first law')"
                    onKeyDown={(e) => e.key === "Enter" && askStudyBuddy()}
                    className="flex-1 p-3 rounded-lg border-0 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/20"
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-60"
                  >
                    {loading ? "Thinking..." : "Ask"}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto">
                {chatHistory.map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-white/90 font-medium">You:</p>
                      <p className="text-white mt-1">{c.question}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <p className="text-white/90 font-medium">Tutor:</p>
                      <p className="text-white mt-1">{c.answer}</p>
                    </div>
                  </div>
                ))}

                {chatHistory.length === 0 && (
                  <div className="text-center text-white/70 py-8">
                    Ask anything — answers are mocked locally (so UI works offline).
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
