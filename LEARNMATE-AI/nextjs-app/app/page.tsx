'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface Flashcard {
  front: string
  back: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

type TabId = 'flashcards' | 'quiz' | 'study-buddy'

export default function LearnAI() {
  const [activeTab, setActiveTab] = useState<TabId>('flashcards')
  const [loading, setLoading] = useState(false)

  // Flashcards
  const [notes, setNotes] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Quiz
  const [quizText, setQuizText] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  // Study Buddy
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([])

  // Simple “confetti” emoji burst on quiz complete (no deps)
  const [burst, setBurst] = useState(false)
  const burstTimer = useRef<number | null>(null)
  useEffect(() => {
    if (showResults) {
      setBurst(true)
      if (burstTimer.current) window.clearTimeout(burstTimer.current)
      burstTimer.current = window.setTimeout(() => setBurst(false), 1800)
    }
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current)
    }
  }, [showResults])

  // --- Server actions (fetch to your API routes) ---
  const generateFlashcards = async () => {
    if (!notes.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (data.flashcards) {
        setFlashcards(data.flashcards)
        setCurrentCard(0)
        setFlipped(false)
      }
    } catch (e) {
      console.error('Error generating flashcards:', e)
    }
    setLoading(false)
  }

  const generateQuiz = async () => {
    if (!quizText.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: quizText }),
      })
      const data = await res.json()
      if (data.quiz) {
        setQuiz(data.quiz)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResults(false)
        setScore(0)
      }
    } catch (e) {
      console.error('Error generating quiz:', e)
    }
    setLoading(false)
  }

  const askStudyBuddy = async () => {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/study-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      if (data.answer) {
        const newChat = { question, answer: data.answer }
        setChatHistory((prev) => [...prev, newChat])
        setQuestion('')
      }
    } catch (e) {
      console.error('Error asking study buddy:', e)
    }
    setLoading(false)
  }

  // --- Flashcards nav ---
  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard((c) => c + 1)
      setFlipped(false)
    }
  }
  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard((c) => c - 1)
      setFlipped(false)
    }
  }

  // --- Quiz logic ---
  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    if (answerIndex === quiz[currentQuestion].correct) setScore((s) => s + 1)

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion((q) => q + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 1200)
  }

  const tabs: { id: TabId; label: string; desc: string }[] = useMemo(
    () => [
      { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
      { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
      { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' },
    ],
    []
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#a78bfa_0%,#f472b6_35%,#fb7185_65%,#60a5fa_100%)] opacity-40 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 via-pink-500/60 to-rose-500/60" />
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md">
            <span className="text-xl">✨</span>
            <span className="text-sm">AI-Powered Learning Playground</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-5xl">
            LearnAI
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-white/85">
            Turn your notes into flashcards, build quizzes, and chat with a study buddy.
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <nav className="flex items-center gap-2 rounded-full bg-white/15 p-2 backdrop-blur-md">
            {tabs.map((t) => {
              const active = activeTab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`group relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-indigo-700 shadow-lg'
                      : 'text-white hover:bg-white/20 hover:shadow'
                  }`}
                  aria-pressed={active}
                >
                  {t.label}
                  <span
                    className={`ml-1 text-[11px] ${
                      active ? 'text-indigo-600/80' : 'text-white/70'
                    }`}
                  >
                    · {t.desc}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <main className="mx-auto max-w-4xl">
          {/* Flashcards */}
          {activeTab === 'flashcards' && (
            <section className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl shadow-xl ring-1 ring-white/15">
              <h2 className="mb-4 text-2xl font-bold text-white">🃏 Flashcard Maker</h2>

              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes… I'll create crisp Q↔A cards for you."
                    className="w-full h-40 resize-y rounded-xl border-0 bg-white/20 p-4 text-white placeholder-white/70 outline-none ring-2 ring-transparent focus:ring-white/40"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '✨ Generating…' : 'Generate Flashcards'}
                    </button>
                    <span className="text-sm text-white/70">Tip: bullet your notes for better cards.</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between text-white/90">
                    <span>
                      Card <b>{currentCard + 1}</b> of <b>{flashcards.length}</b>
                    </span>
                    <button
                      onClick={() => setFlashcards([])}
                      className="rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white shadow hover:scale-[1.02] active:scale-[0.98] transition"
                    >
                      New Set
                    </button>
                  </div>

                  {/* Flip card */}
                  <div
                    className="relative mx-auto mb-6 h-64 w-full max-w-3xl cursor-pointer perspective"
                    onClick={() => setFlipped((f) => !f)}
                    aria-label="Flip flashcard"
                  >
                    <div className={`preserve-3d absolute inset-0 transition-transform duration-700 ${flipped ? 'rotate-y-180' : ''}`}>
                      {/* front */}
                      <div className="card-face glass-front">
                        <p className="text-lg font-semibold leading-relaxed text-indigo-900/95">
                          {flashcards[currentCard]?.front}
                        </p>
                        <span className="badge">Front</span>
                      </div>
                      {/* back */}
                      <div className="card-face glass-back rotate-y-180">
                        <p className="text-lg leading-relaxed text-white">
                          {flashcards[currentCard]?.back}
                        </p>
                        <span className="badge badge-invert">Back</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="btn-soft disabled:opacity-40"
                    >
                      ⬅️ Previous
                    </button>
                    <button
                      onClick={() => setFlipped((f) => !f)}
                      className="btn-soft"
                    >
                      🔁 Flip
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="btn-soft disabled:opacity-40"
                    >
                      Next ➡️
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Quiz */}
          {activeTab === 'quiz' && (
            <section className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl shadow-xl ring-1 ring-white/15">
              <h2 className="mb-4 text-2xl font-bold text-white">📝 Quiz Maker</h2>

              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text or notes… I'll build MCQs with explanations."
                    className="w-full h-40 resize-y rounded-xl border-0 bg-white/20 p-4 text-white placeholder-white/70 outline-none ring-2 ring-transparent focus:ring-white/40"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⚙️ Creating…' : 'Create Quiz'}
                    </button>
                    <span className="text-sm text-white/70">Auto-grades as you go.</span>
                  </div>
                </div>
              ) : showResults ? (
                <div className="relative text-center">
                  {burst && (
                    <div className="pointer-events-none absolute inset-0 flex animate-burst items-center justify-center text-5xl">
                      <span>🎉</span>
                      <span className="mx-3">🎊</span>
                      <span>🎉</span>
                    </div>
                  )}
                  <h3 className="mb-3 text-3xl font-extrabold text-white">Quiz Complete!</h3>
                  <p className="mb-6 text-xl text-white/90">
                    You scored <b>{score}</b> / <b>{quiz.length}</b>{' '}
                    (<b>{Math.round((score / quiz.length) * 100)}%</b>)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="btn-primary"
                  >
                    Take Another Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between text-white/90">
                    <span>
                      Question <b>{currentQuestion + 1}</b> of <b>{quiz.length}</b>
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm">Score: {score}</span>
                  </div>

                  <div className="mb-5 rounded-xl bg-white/15 p-4 ring-1 ring-white/15">
                    <h3 className="text-xl font-bold text-white">{quiz[currentQuestion]?.question}</h3>
                  </div>

                  <div className="space-y-3">
                    {quiz[currentQuestion]?.options.map((option, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrect = index === quiz[currentQuestion].correct
                      const state =
                        selectedAnswer === null
                          ? 'idle'
                          : isSelected && isCorrect
                          ? 'right'
                          : isSelected && !isCorrect
                          ? 'wrong'
                          : isCorrect
                          ? 'reveal'
                          : 'dim'
                      return (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full rounded-xl p-4 text-left font-medium transition
                            ${state === 'idle' ? 'bg-white/20 text-white hover:bg-white/30 hover:shadow'
                              : state === 'right' ? 'bg-emerald-500 text-white shadow-lg scale-[1.01]'
                              : state === 'wrong' ? 'bg-rose-500 text-white shadow-lg'
                              : state === 'reveal' ? 'bg-emerald-500/80 text-white'
                              : 'bg-white/10 text-white/60'}`
                          }
                        >
                          <span className="mr-2">•</span> {option}
                        </button>
                      )
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="mt-4 rounded-xl bg-white/15 p-4 text-white ring-1 ring-white/15">
                      <p className="font-semibold">Why?</p>
                      <p className="opacity-90">{quiz[currentQuestion]?.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Study Buddy */}
          {activeTab === 'study-buddy' && (
            <section className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl shadow-xl ring-1 ring-white/15">
              <h2 className="mb-4 text-2xl font-bold text-white">🤖 Ask-Me Study Buddy</h2>

              <div className="mb-5 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything… concepts, examples, step-by-steps."
                  className="flex-1 rounded-xl border-0 bg-white/20 p-4 text-white placeholder-white/70 outline-none ring-2 ring-transparent focus:ring-white/40"
                  onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                />
                <button
                  onClick={askStudyBuddy}
                  disabled={loading || !question.trim()}
                  className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Thinking…' : 'Ask'}
                </button>
              </div>

              <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
                {chatHistory.length === 0 ? (
                  <div className="rounded-xl bg-white/10 p-6 text-center text-white/70">
                    Ask me anything and I’ll help you learn! I can explain concepts, provide examples, and answer your questions.
                  </div>
                ) : (
                  chatHistory.map((chat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="bubble-user">
                        <div className="font-semibold">You</div>
                        <div>{chat.question}</div>
                      </div>
                      <div className="bubble-bot">
                        <div className="font-semibold">Study Buddy</div>
                        <div>{chat.answer}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Styles (keyframes + utilities) */}
      <style jsx>{`
        /* Animated gradient sweep */
        @keyframes gradient-sweep {
          0% { transform: translateX(-15%) translateY(-10%) scale(1.05); }
          50% { transform: translateX(10%) translateY(8%) scale(1.08); }
          100% { transform: translateX(-15%) translateY(-10%) scale(1.05); }
        }
        .animate-gradient {
          animation: gradient-sweep 16s ease-in-out infinite;
        }

        /* 3D flip */
        .perspective { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .card-face {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.25rem;
          border-radius: 1rem;
          backface-visibility: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .glass-front {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.5);
        }
        .glass-back {
          background: linear-gradient(135deg, rgba(99,102,241,0.95), rgba(236,72,153,0.95));
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
        }

        /* Badges on card faces */
        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.8);
          color: #4338ca;
          font-weight: 700;
        }
        .badge-invert {
          background: rgba(0,0,0,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.4);
        }

        /* Emoji burst */
        @keyframes pop {
          0% { transform: scale(0.6) translateY(8px); opacity: 0; }
          30% { transform: scale(1.15) translateY(-6px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 0; }
        }
        .animate-burst span { animation: pop 1.1s ease both; }
        .animate-burst span:nth-child(1) { animation-delay: 0s; }
        .animate-burst span:nth-child(2) { animation-delay: .1s; }
        .animate-burst span:nth-child(3) { animation-delay: .2s; }
      `}</style>

      {/* Utility button styles using Tailwind classes via @apply-like approach (inline classnames) */}
      <style jsx>{`
        .btn-primary {
          border-radius: 9999px;
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(90deg, #ec4899, #6366f1);
          box-shadow: 0 10px 25px rgba(99,102,241,0.35);
          transition: transform .15s ease, filter .15s ease, box-shadow .2s ease;
        }
        .btn-primary:hover { transform: translateY(-1px) scale(1.02); filter: brightness(1.03); }
        .btn-primary:active { transform: translateY(0) scale(0.99); }

        .btn-success {
          border-radius: 9999px;
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(90deg, #34d399, #22c55e);
          box-shadow: 0 10px 25px rgba(34,197,94,0.35);
          transition: transform .15s ease, filter .15s ease, box-shadow .2s ease;
        }
        .btn-success:hover { transform: translateY(-1px) scale(1.02); filter: brightness(1.03); }
        .btn-success:active { transform: translateY(0) scale(0.99); }

        .btn-soft {
          border-radius: 9999px;
          padding: 0.6rem 1rem;
          font-weight: 700;
          color: white;
          background: rgba(255,255,255,0.18);
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          transition: transform .15s ease, background .15s ease;
        }
        .btn-soft:hover { transform: translateY(-1px) scale(1.02); background: rgba(255,255,255,0.28); }
        .btn-soft:active { transform: translateY(0) scale(0.98); }
      `}</style>
    </div>
  )
}
