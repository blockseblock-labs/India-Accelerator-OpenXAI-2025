'use client'

import { useState, useEffect, useRef } from 'react'

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

interface FallingSymbol {
  id: number
  symbol: string
  x: number
  y: number
  speed: number
  opacity: number
  size: number
}

export default function LearnAI() {
  const [activeTab, setActiveTab] = useState('flashcards')
  const [loading, setLoading] = useState(false)
  const [symbols, setSymbols] = useState<FallingSymbol[]>([])
  
  // Flashcard states
  const [notes, setNotes] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [numCards, setNumCards] = useState(5)
  const [autoPlay, setAutoPlay] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Quiz states
  const [quizText, setQuizText] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const TIMER_PER_QUESTION = 20

  // Study Buddy states
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])

  // Enhanced educational symbols with sophisticated colors
  const educationalSymbols = [
    // Biology symbols - sophisticated
    '🧬', '🦠', 'DNA', 'Cell', 'Gene', 'ATP', 'CO₂', 'H₂O', 'RNA', '💊', '👩‍⚕', '🩺', '💉',
    // Chemistry symbols - sophisticated
    'NaCl', 'CH₄', 'NH₃', 'HCl', 'Fe', 'Au', 'Cu', 'Zn', '🧪', '📐',
    // Computer Science symbols - sophisticated
    'AI', 'ML', 'API', 'HTTP', 'JSON', 'CSS', 'HTML', 'SQL', '0', '1', '👩🏻‍💻', '📓', '✍🏻', '💡',
    // Mathematics symbols - sophisticated
    '∫', '∑', '√', 'π', '∞', 'α', 'β', 'γ', 'δ', 'ε'
  ]

  // Enhanced rain animation with sophisticated effects
  useEffect(() => {
    const initialSymbols: FallingSymbol[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      symbol: educationalSymbols[Math.floor(Math.random() * educationalSymbols.length)],
      x: Math.random() * 100,
      y: -Math.random() * 150,
      speed: 0.3 + Math.random() * 0.8,
      opacity: 0.15 + Math.random() * 0.3,
      size: 18
    }))
    setSymbols(initialSymbols)

    const interval = setInterval(() => {
      setSymbols(prevSymbols =>
        prevSymbols.map(symbol => {
          let newY = symbol.y + symbol.speed
          let newX = symbol.x
          if (newY > 110) {
            return {
              ...symbol,
              y: -10,
              x: Math.random() * 100,
              symbol: educationalSymbols[Math.floor(Math.random() * educationalSymbols.length)],
              speed: 0.3 + Math.random() * 0.8,
              opacity: 0.15 + Math.random() * 0.3,
              size: 18
            }
          }
          return { ...symbol, y: newY, x: newX }
        })
      )
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Flashcard slideshow autoplay
  useEffect(() => {
    if (!autoPlay || flashcards.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      return
    }
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentCard(prev => (prev < flashcards.length - 1 ? prev + 1 : 0))
        setFlipped(false)
      }, 2000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [autoPlay, flashcards, currentCard])

  // Download flashcards as CSV
  const downloadFlashcards = () => {
    const csv = [
      ['Front', 'Back'],
      ...flashcards.map(card => [
        `"${card.front.replace(/"/g, '""')}"`,
        `"${card.back.replace(/"/g, '""')}"`
      ])
    ].map(row => row.join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flashcards.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateFlashcards = async () => {
    if (!notes.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, numCards })
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
        setChatHistory(prev => [...prev, newChat])
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
      setCurrentCard(currentCard + 1)
      setFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setFlipped(false)
    }
  }

  // Timer effect for quiz
  useEffect(() => {
    if (activeTab !== 'quiz' || quiz.length === 0 || showResults) return
    if (selectedAnswer !== null) return // pause timer if answered

    setTimeLeft(TIMER_PER_QUESTION)
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Time's up, auto-advance
          setSelectedAnswer(-1) // mark as incorrect
          setTimeout(() => {
            if (currentQuestion < quiz.length - 1) {
              setCurrentQuestion(q => q + 1)
              setSelectedAnswer(null)
              setTimeLeft(TIMER_PER_QUESTION)
            } else {
              setShowResults(true)
            }
          }, 1200)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line
  }, [activeTab, quiz, currentQuestion, selectedAnswer, showResults])

  // Update selectAnswer to stop timer and only score if correct and in time
  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    if (answerIndex === quiz[currentQuestion].correct && timeLeft > 0) {
      setScore(score + 1)
    }
    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setTimeLeft(TIMER_PER_QUESTION)
      } else {
        setShowResults(true)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced navy blue gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)'
          }}
        />
      </div>

      {/* Enhanced educational rain background */}
      <div className="absolute inset-0 pointer-events-none">
        {symbols.map(symbol => {
          let color = '#94a3b8'
          let textShadow = '0 0 3px rgba(148, 163, 184, 0.2)'
          let fontWeight = '300'
          if (['🧬', '🦠', 'DNA', 'Cell', 'Gene', 'Protein', 'ATP', 'CO₂', 'H₂O', 'RNA', '💊', '👩‍⚕', '🩺', '💉'].some(bio => symbol.symbol.includes(bio))) {
            color = '#6b8e5a'
            textShadow = '0 0 3px rgba(107, 142, 90, 0.3)'
          } else if (['H₂O', 'CO₂', 'NaCl', 'CH₄', 'NH₃', 'HCl', 'Fe', 'Au', 'Cu', 'Zn', '🧪', '📐'].some(chem => symbol.symbol.includes(chem))) {
            color = '#7dd3fc'
            textShadow = '0 0 3px rgba(125, 211, 252, 0.3)'
          } else if (['AI', 'ML', 'API', 'HTTP', 'JSON', 'CSS', 'HTML', 'SQL', '0', '1', '👩🏻‍💻', '📓', '✍🏻', '💡'].some(cs => symbol.symbol.includes(cs))) {
            color = '#a78bfa'
            textShadow = '0 0 3px rgba(167, 139, 250, 0.3)'
          } else if (['∫', '∑', '√', 'π', '∞', 'α', 'β', 'γ', 'δ', 'ε'].some(math => symbol.symbol.includes(math))) {
            color = '#f87171'
            textShadow = '0 0 3px rgba(248, 113, 113, 0.3)'
          }
          return (
            <div
              key={symbol.id}
              className="absolute font-mono raining-symbol-enhanced"
              style={{
                left: `${symbol.x}%`,
                top: `${symbol.y}%`,
                opacity: symbol.opacity,
                fontSize: `${symbol.size}px`,
                color: color,
                textShadow: textShadow,
                fontWeight: fontWeight,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                transition: 'top 0.08s linear',
                letterSpacing: fontWeight === '500' ? '0.05em' : 'normal'
              }}
              title={symbol.symbol}
            >
              {symbol.symbol}
            </div>
          )
        })}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-8 py-6 glass-card">
            <h1 className="text-5xl font-light text-white mb-4 tracking-tight">
              Learn<span className="text-gradient">AI</span>
            </h1>
            <p className="text-gray-400 text-lg font-light">Intelligent learning tools</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex glass-card-subtle rounded-full p-1">
            {[
              { id: 'flashcards', label: 'Cards' },
              { id: 'quiz', label: 'Quiz' },
              { id: 'study-buddy', label: 'Chat' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 micro-interaction ${
                  activeTab === tab.id
                    ? 'bg-gray-700/50 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="max-w-2xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="glass-card p-8 animate-fade-in-up">
              <h2 className="text-2xl font-light text-white mb-6">Flashcards</h2>
              
              {flashcards.length === 0 ? (
                <div className="space-y-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your notes here..."
                    className="w-full h-32 p-4 rounded-lg border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-0 resize-none transition-colors glass-card-subtle"
                  />
                  <div className="flex items-center space-x-4">
                    <label className="text-gray-400 text-sm">
                      Number of cards:
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={numCards}
                        onChange={e => setNumCards(Number(e.target.value))}
                        className="ml-2 w-16 p-1 rounded bg-gray-900/50 border border-gray-600 text-white glass-card-subtle"
                      />
                    </label>
                  </div>
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="w-full py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Cards'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
                    <span>
                      {currentCard + 1} / {flashcards.length}
                    </span>
                    <button
                      onClick={downloadFlashcards}
                      className="px-3 py-1 btn-secondary transition-colors text-xs"
                    >
                      Download Cards
                    </button>
                  </div>
                  
                  <div 
                    className={`flashcard-enhanced ${flipped ? 'flipped' : ''} mb-6 cursor-pointer`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <p className="text-lg text-white">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className="flashcard-back">
                        <p className="text-lg text-white">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Slideshow controls */}
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <button
                      onClick={() => {
                        setAutoPlay(false)
                        prevCard()
                      }}
                      className="px-3 py-2 btn-secondary"
                      title="Previous"
                    >
                      ⏮
                    </button>
                    {autoPlay ? (
                      <button
                        onClick={() => setAutoPlay(false)}
                        className="px-3 py-2 btn-secondary"
                        title="Pause"
                      >
                        ⏸
                      </button>
                    ) : (
                      <button
                        onClick={() => setAutoPlay(true)}
                        className="px-3 py-2 btn-secondary"
                        title="Play"
                      >
                        ▶️
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setAutoPlay(false)
                        nextCard()
                      }}
                      className="px-3 py-2 btn-secondary"
                      title="Next"
                    >
                      ⏭
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        setFlashcards([])
                        setAutoPlay(true)
                        setNumCards(5)
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      New
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="glass-card p-8 animate-fade-in-up">
              <h2 className="text-2xl font-light text-white mb-6">Quiz</h2>
              
              {quiz.length === 0 && !showResults ? (
                <div className="space-y-4">
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here..."
                    className="w-full h-32 p-4 rounded-lg border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-0 resize-none transition-colors glass-card-subtle"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="w-full py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Quiz'}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-light text-white mb-4">Complete</h3>
                  <p className="text-xl text-gray-400 mb-6">
                    {score} / {quiz.length} correct
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-6 py-3 btn-secondary"
                  >
                    New Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between items-center text-sm text-gray-400">
                    <span>Question {currentQuestion + 1} / {quiz.length}</span>
                    <span>Score: {score}</span>
                    <span>
                      Time:{" "}
                      <span className={timeLeft <= 5 ? "text-red-400 font-bold" : "text-white"}>
                        {timeLeft}s
                      </span>
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-light text-white mb-4">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 text-left rounded-lg border transition-all quiz-option ${
                            selectedAnswer === null
                              ? 'border-gray-600 text-white hover:border-gray-500 hover:bg-gray-700/50 glass-card-subtle'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'border-green-500 bg-green-900/30 text-green-100'
                                : 'border-red-500 bg-red-900/30 text-red-100'
                              : index === quiz[currentQuestion].correct
                              ? 'border-green-500 bg-green-900/30 text-green-100'
                              : 'border-gray-600 text-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-4">
                        {selectedAnswer === quiz[currentQuestion].correct ? (
                          <span className="text-green-400 font-semibold text-lg">Correct!</span>
                        ) : (
                          <span className="text-red-400 font-semibold text-lg">
                            {selectedAnswer === -1 ? 'Time\'s up! Incorrect.' : 'Incorrect.'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="glass-card p-8 animate-fade-in-up">
              <h2 className="text-2xl font-light text-white mb-6">Study Buddy</h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 p-4 rounded-lg border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-0 transition-colors glass-card-subtle"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '...' : 'Ask'}
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="glass-card-subtle p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-300">You</p>
                        <p className="text-gray-400">{chat.question}</p>
                      </div>
                      <div className="glass-card-subtle p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-300">Study Buddy</p>
                        <p className="text-gray-400">{chat.answer}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                      <p className="text-sm">Ask me anything and I'll help you learn.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
