"use client"

import React, { useEffect, useState } from 'react'

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

export default function LearnAI() {
  const [activeTab, setActiveTab] = useState('flashcards')
  const [loading, setLoading] = useState(false)

  // Flashcard states
  const [notes, setNotes] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Quiz states
  const [quizText, setQuizText] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  // Study Buddy states
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([])

  useEffect(() => {
    // keyboard nav for cards and quiz
    const handler = (e: KeyboardEvent) => {
      if (activeTab === 'flashcards') {
        if (e.key === 'ArrowRight') nextCard()
        if (e.key === 'ArrowLeft') prevCard()
        if (e.key === ' ') setFlipped((f) => !f)
      }
      if (activeTab === 'quiz' && quiz.length > 0 && selectedAnswer === null) {
        if (e.key >= '1' && e.key <= '9') {
          const idx = parseInt(e.key, 10) - 1
          if (idx < (quiz[currentQuestion]?.options.length ?? 0)) selectAnswer(idx)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeTab, quiz, currentQuestion, selectedAnswer, flashcards.length])

  const generateFlashcards = async () => {
    if (!notes.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })

      const data = await response.json()
      if (data.flashcards) {
        setFlashcards(data.flashcards)
        setCurrentCard(0)
        setFlipped(false)
      }
    } catch (error) {
      console.error('Error generating flashcards:', error)
    }
    setLoading(false)
  }

  const generateQuiz = async () => {
    if (!quizText.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: quizText })
      })

      const data = await response.json()
      if (data.quiz) {
        setQuiz(data.quiz)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResults(false)
        setScore(0)
      }
    } catch (error) {
      console.error('Error generating quiz:', error)
    }
    setLoading(false)
  }

  const askStudyBuddy = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/study-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })

      const data = await response.json()
      if (data.answer) {
        const newChat = { question, answer: data.answer }
        setChatHistory((prev) => [...prev, newChat])
        setAnswer(data.answer)
        setQuestion('')
      }
    } catch (error) {
      console.error('Error asking study buddy:', error)
    }
    setLoading(false)
  }

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

  const selectAnswer = (answerIndex: number) => {
    if (!quiz.length) return
    setSelectedAnswer(answerIndex)

    if (answerIndex === quiz[currentQuestion].correct) {
      setScore((s) => s + 1)
    }

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion((q) => q + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 900)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">📚 LearnAI</h1>
          <p className="text-white/90">AI-powered flashcards, quizzes and a study buddy — fast and simple.</p>
        </header>

        <div className="flex justify-center mb-6">
          <nav className="bg-white/10 backdrop-blur rounded-xl p-2 flex gap-2">
            {[
              { id: 'flashcards', label: '🃏 Flashcards' },
              { id: 'quiz', label: '📝 Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/40 ${
                  activeTab === tab.id ? 'bg-white text-purple-600 shadow-lg' : 'text-white hover:bg-white/5'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="space-y-6">
          {/* FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">🃏 Flashcard Maker</h2>
                <div className="text-white/80">{flashcards.length ? `${currentCard + 1}/${flashcards.length}` : 'No cards yet'}</div>
              </div>

              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {loading ? 'Generating...' : 'Generate Flashcards'}
                    </button>

                    <button
                      onClick={() => { setNotes('') }}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col items-center">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setFlipped((f) => !f)}
                      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
                      className={`w-full md:w-3/4 lg:w-2/3 aspect-[3/2] relative perspective mb-4 cursor-pointer select-none`}
                      aria-label="Flashcard - click to flip"
                    >
                      <div className={`flashcard-inner ${flipped ? 'is-flipped' : ''}`}>
                        <div className="flashcard-face flashcard-front p-6 rounded-xl shadow-2xl flex items-center justify-center">
                          <p className="text-xl font-semibold text-white text-center">{flashcards[currentCard]?.front}</p>
                        </div>
                        <div className="flashcard-face flashcard-back p-6 rounded-xl shadow-2xl flex items-center justify-center">
                          <p className="text-lg text-white/95 text-center">{flashcards[currentCard]?.back}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-3/4 lg:w-2/3 flex items-center justify-between gap-3">
                      <button onClick={prevCard} disabled={currentCard === 0} className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50">Previous</button>
                      <div className="flex gap-2">
                        <button onClick={() => setFlashcards([])} className="px-4 py-2 bg-red-500 rounded-lg text-white">New</button>
                        <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(flashcards, null, 2)) }} className="px-4 py-2 bg-white/10 rounded-lg text-white">Copy JSON</button>
                      </div>
                      <button onClick={nextCard} disabled={currentCard === flashcards.length - 1} className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50">Next</button>
                    </div>

                    <div className="w-full md:w-3/4 lg:w-2/3 mt-3">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white/40 rounded-full transition-all" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </section>
          )}

          {/* QUIZ */}
          {activeTab === 'quiz' && (
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">📝 Quiz Maker</h2>
                <div className="text-white/80">{quiz.length ? `${currentQuestion + 1}/${quiz.length}` : 'No quiz yet'}</div>
              </div>

              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create a quiz for you..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  />
                  <div className="mt-4 flex gap-3">
                    <button onClick={generateQuiz} disabled={loading || !quizText.trim()} className="px-5 py-3 bg-green-600 rounded-lg text-white disabled:opacity-50">{loading ? 'Creating...' : 'Create Quiz'}</button>
                    <button onClick={() => setQuizText('')} className="px-5 py-3 bg-white/10 rounded-lg text-white">Clear</button>
                  </div>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
                  <p className="text-xl text-white mb-6">You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)</p>
                  <button onClick={() => { setQuiz([]); setShowResults(false); setScore(0) }} className="px-6 py-3 bg-blue-600 rounded-lg text-white">Take Another Quiz</button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-white">Question {currentQuestion + 1} of {quiz.length}</div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">{quiz[currentQuestion]?.question}</h3>

                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options.map((option, index) => {
                        const isSelected = selectedAnswer === index
                        const isCorrect = index === quiz[currentQuestion].correct

                        let classes = 'w-full p-4 text-left rounded-lg transition-all ';
                        if (selectedAnswer === null) classes += 'bg-white/10 text-white hover:bg-white/20'
                        else if (isSelected && isCorrect) classes += 'bg-green-600 text-white'
                        else if (isSelected && !isCorrect) classes += 'bg-red-600 text-white'
                        else if (!isSelected && isCorrect) classes += 'bg-green-500/30 text-white'
                        else classes += 'bg-white/5 text-white/70'

                        return (
                          <button key={index} onClick={() => selectAnswer(index)} disabled={selectedAnswer !== null} className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{index + 1}</div>
                              <div>{option}</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {selectedAnswer !== null && (
                      <div className="mt-4 p-4 bg-white/10 rounded-lg">
                        <p className="text-white font-medium">Explanation:</p>
                        <p className="text-white/90">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STUDY BUDDY */}
          {activeTab === 'study-buddy' && (
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🤖 Ask-Me Study Buddy</h2>

              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything you want to learn about..."
                  className="flex-1 p-4 rounded-lg border-0 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                />
                <button onClick={askStudyBuddy} disabled={loading || !question.trim()} className="px-5 py-3 bg-purple-600 rounded-lg text-white disabled:opacity-50">{loading ? 'Thinking...' : 'Ask'}</button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-white/60 py-8">Ask me anything and I'll help you learn!</div>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-white/6 p-4 rounded-lg">
                        <p className="text-white font-medium">You:</p>
                        <p className="text-white/90">{chat.question}</p>
                      </div>
                      <div className="bg-white/6 p-4 rounded-lg">
                        <p className="text-white font-medium">Study Buddy:</p>
                        <p className="text-white/90">{chat.answer}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

        </main>

      </div>

      {/* Lightweight styles for flashcard flip and small helpers */}
      <style>{`
        .perspective { perspective: 1200px; }
        .flashcard-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s; }
        .flashcard-inner.is-flipped { transform: rotateY(180deg); }
        .flashcard-face { backface-visibility: hidden; position: absolute; inset: 0; display: flex; }
        .flashcard-back { transform: rotateY(180deg); }
        /* quick helper classes used above - keep them scoped */
      `}</style>
    </div>
  )
}
