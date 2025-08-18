'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Tab/view from URL
  const initialView = searchParams.get('view') || 'home'
  const [activeTab, setActiveTab] = useState(initialView) // 'home' | 'flashcards' | 'quiz' | 'study-buddy'
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
  const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])

  // keep URL & tab in sync
  const setView = (view: string) => {
    const sp = new URLSearchParams(searchParams.toString())
    if (view === 'home') sp.delete('view')
    else sp.set('view', view)
    router.push(`${pathname}?${sp.toString()}`, { scroll: true })
    setActiveTab(view)
  }

  useEffect(() => {
    setActiveTab(initialView)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialView])

  // API calls (unchanged logic)
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
        const newChat = { question, answer: data.answer as string }
        setChatHistory(prev => [...prev, newChat])
        setQuestion('')
      }
    } catch (error) {
      console.error('Error asking study buddy:', error)
    }
    setLoading(false)
  }

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(c => c + 1)
      setFlipped(false)
    }
  }
  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(c => c - 1)
      setFlipped(false)
    }
  }
  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    if (answerIndex === quiz[currentQuestion].correct) setScore(s => s + 1)
    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(q => q + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 1200)
  }

  const tabs = useMemo(() => ([
    { id: 'flashcards', label: 'Flashcards', desc: 'Make Flashcards' },
    { id: 'quiz', label: 'Quiz', desc: 'Create Quiz' },
    { id: 'study-buddy', label: 'Study Buddy', desc: 'Ask Questions' }
  ]), [])

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 pb-20">
      {/* Hero / Home */}
      <AnimatePresence mode="popLayout">
        {activeTab === 'home' && (
          <motion.section
            key="home"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Learn smarter with <span className="text-indigo-600">AI</span>
            </motion.h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Generate flashcards, craft quizzes, and chat with a study buddy. Simple, focused, and fast.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setView('quiz')} className="btn-primary">Start a Quiz</button>
              <button onClick={() => setView('flashcards')} className="btn-ghost">Try Flashcards</button>
            </div>

            {/* Feature cards */}
            <div className="mt-12 grid sm:grid-cols-3 gap-5">
              {[
                { t: 'AI Flashcards', d: 'Make crisp flashcards from any notes.', i: '🃏' },
                { t: 'Smart Quizzes', d: 'Auto-generate MCQs with explanations.', i: '📝' },
                { t: 'Study Buddy', d: 'Ask, clarify, and go deeper.', i: '🤖' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="card"
                >
                  <div className="text-3xl">{f.i}</div>
                  <div className="mt-2 font-semibold text-lg">{f.t}</div>
                  <p className="text-sm text-gray-600 mt-1">{f.d}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Tabs header when inside a tool */}
      {activeTab !== 'home' && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`chip ${activeTab === tab.id ? 'chip-active' : ''}`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-2">{tab.desc}</span>
            </button>
          ))}
          <div className="ml-auto">
            <button onClick={() => setView('home')} className="text-sm text-gray-600 hover:text-indigo-600">
              ← Back to Home
            </button>
          </div>
        </div>
      )}

      {/* FLASHCARDS */}
      <AnimatePresence mode="popLayout">
        {activeTab === 'flashcards' && (
          <motion.section
            key="flashcards"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="panel"
          >
            <h2 className="panel-title">🃏 Flashcard Maker</h2>

            {flashcards.length === 0 ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your study notes here..."
                  className="textarea"
                />
                <button
                  onClick={generateFlashcards}
                  disabled={loading || !notes.trim()}
                  className="btn-primary w-full mt-3"
                >
                  {loading ? 'Generating...' : 'Generate Flashcards'}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-3 text-sm text-gray-600">
                  Card {currentCard + 1} of {flashcards.length}
                </div>

                <div
                  className={`flip-card ${flipped ? 'is-flipped' : ''}`}
                  onClick={() => setFlipped(f => !f)}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-face">
                      <p className="text-lg font-medium text-center">{flashcards[currentCard]?.front}</p>
                    </div>
                    <div className="flip-card-face flip-card-back">
                      <p className="text-lg text-center">{flashcards[currentCard]?.back}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button onClick={prevCard} disabled={currentCard === 0} className="btn-outline">Prev</button>
                  <button onClick={() => setFlashcards([])} className="btn-danger">New Set</button>
                  <button onClick={nextCard} disabled={currentCard === flashcards.length - 1} className="btn-outline">Next</button>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* QUIZ */}
      <AnimatePresence mode="popLayout">
        {activeTab === 'quiz' && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="panel"
          >
            <h2 className="panel-title">📝 Quiz Maker</h2>

            {quiz.length === 0 && !showResults ? (
              <div>
                <textarea
                  value={quizText}
                  onChange={(e) => setQuizText(e.target.value)}
                  placeholder="Paste text and I’ll create a quiz..."
                  className="textarea"
                />
                <button
                  onClick={generateQuiz}
                  disabled={loading || !quizText.trim()}
                  className="btn-primary w-full mt-3"
                >
                  {loading ? 'Creating Quiz...' : 'Create Quiz'}
                </button>
              </div>
            ) : showResults ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Quiz Complete 🎉</h3>
                <p className="text-lg mb-4">
                  You scored {score} of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                </p>
                <button
                  onClick={() => { setQuiz([]); setShowResults(false); setScore(0); setCurrentQuestion(0); setSelectedAnswer(null); }}
                  className="btn-ghost"
                >
                  Take Another Quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-2 text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.length}
                </div>
                <div className="card p-5">
                  <h3 className="text-lg font-semibold">{quiz[currentQuestion]?.question}</h3>
                  <div className="mt-4 space-y-3">
                    {quiz[currentQuestion]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`option ${selectedAnswer === null ? 'option-idle'
                          : index === quiz[currentQuestion].correct
                            ? 'option-correct'
                            : selectedAnswer === index
                              ? 'option-wrong'
                              : 'option-disabled'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-lg bg-gray-50 p-4 border"
                    >
                      <p className="font-medium">Explanation</p>
                      <p className="text-gray-700 mt-1">{quiz[currentQuestion]?.explanation}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* STUDY BUDDY */}
      <AnimatePresence mode="popLayout">
        {activeTab === 'study-buddy' && (
          <motion.section
            key="study-buddy"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="panel"
          >
            <h2 className="panel-title">🤖 Ask-Me Study Buddy</h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything you want to learn about..."
                onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                className="input"
              />
              <button
                onClick={askStudyBuddy}
                disabled={loading || !question.trim()}
                className="btn-primary"
              >
                {loading ? 'Thinking...' : 'Ask'}
              </button>
            </div>

            <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Ask anything. I can explain concepts, give examples, and guide your study.
                </div>
              ) : (
                chatHistory.map((chat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bubble user">
                      <p className="label">You</p>
                      <p>{chat.question}</p>
                    </div>
                    <div className="bubble bot">
                      <p className="label">Study Buddy</p>
                      <p>{chat.answer}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}