'use client'

import { useState } from 'react'

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
  const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])

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

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    
    if (answerIndex === quiz[currentQuestion].correct) {
      setScore(score + 1)
    }
    
    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      {/* Main glass shell */}
      <div className="w-full max-w-5xl rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 LearnAI</h1>
            <p className="text-gray-600">AI-Powered Educational Tools</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-2 flex space-x-3 shadow-inner">
              {[
                { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
                { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
                { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg transition-all flex flex-col items-center gap-0 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 font-semibold shadow-lg'
                      : 'text-gray-700 hover:bg-white/30'
                  }`}
                >
                  <div className="text-sm">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Flashcards Tab */}
            {activeTab === 'flashcards' && (
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🃏 Flashcard Maker</h2>
                
                {flashcards.length === 0 ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your study notes here and I'll create flashcards for you..."
                      className="w-full h-40 p-4 rounded-lg border-0 bg-white/30 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/30"
                    />
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={generateFlashcards}
                        disabled={loading || !notes.trim()}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Generating...' : 'Generate Flashcards'}
                      </button>
                      <button
                        onClick={() => { setNotes(''); }}
                        className="px-4 py-2 bg-transparent border border-white/30 text-gray-700 rounded-lg"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-gray-700">
                      Card {currentCard + 1} of {flashcards.length}
                    </div>
                    
                    {/* Flashcard - glass flip */}
                    <div 
                      className={`flashcard mx-auto mb-6 ${flipped ? 'flipped' : ''}`}
                      onClick={() => setFlipped(!flipped)}
                      role="button"
                      aria-pressed={flipped}
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped(!flipped)}
                    >
                      <div className="flashcard-inner">
                        <div className="flashcard-front">
                          <p className="text-lg font-medium text-gray-900">{flashcards[currentCard]?.front}</p>
                        </div>
                        <div className="flashcard-back">
                          <p className="text-lg text-gray-900">{flashcards[currentCard]?.back}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={prevCard}
                        disabled={currentCard === 0}
                        className="px-4 py-2 bg-white/20 text-gray-700 rounded-lg disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFlashcards([])}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          New Flashcards
                        </button>
                        <button
                          onClick={nextCard}
                          disabled={currentCard === flashcards.length - 1}
                          className="px-4 py-2 bg-white/20 text-gray-700 rounded-lg disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Quiz Maker</h2>
                
                {quiz.length === 0 && !showResults ? (
                  <div>
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste text here and I'll create a quiz for you..."
                      className="w-full h-40 p-4 rounded-lg border-0 bg-white/30 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Quiz...' : 'Create Quiz'}
                    </button>
                  </div>
                ) : showResults ? (
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h3>
                    <p className="text-xl text-gray-700 mb-6">
                      You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                    </p>
                    <button
                      onClick={() => {
                        setQuiz([])
                        setShowResults(false)
                        setScore(0)
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
                    >
                      Take Another Quiz
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-gray-700">
                      Question {currentQuestion + 1} of {quiz.length}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {quiz[currentQuestion]?.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {quiz[currentQuestion]?.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => selectAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-lg transition-all quiz-option ${
                              selectedAnswer === null
                                ? 'bg-white/30 text-gray-800 hover:bg-white/40'
                                : selectedAnswer === index
                                ? index === quiz[currentQuestion].correct
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                                : index === quiz[currentQuestion].correct
                                ? 'bg-emerald-300 text-gray-800'
                                : 'bg-white/20 text-gray-600'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      
                      {selectedAnswer !== null && (
                        <div className="mt-4 p-4 bg-white/30 rounded-lg">
                          <p className="text-gray-800 font-medium">Explanation:</p>
                          <p className="text-gray-700">{quiz[currentQuestion]?.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Study Buddy Tab */}
            {activeTab === 'study-buddy' && (
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 Ask-Me Study Buddy</h2>
                
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything you want to learn about..."
                      className="flex-1 p-4 rounded-lg border-0 bg-white/30 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/30"
                      onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                    />
                    <button
                      onClick={askStudyBuddy}
                      disabled={loading || !question.trim()}
                      className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Thinking...' : 'Ask'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-white/25 p-4 rounded-lg">
                        <p className="text-gray-800 font-medium">You:</p>
                        <p className="text-gray-700">{chat.question}</p>
                      </div>
                      <div className="bg-white/25 p-4 rounded-lg">
                        <p className="text-gray-800 font-medium">Study Buddy:</p>
                        <p className="text-gray-700">{chat.answer}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component-scoped styles for flip animation */}
      <style jsx>{`
        .flashcard {
          width: 100%;
          max-width: 540px;
          height: 260px;
          perspective: 1200px;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(.2,.9,.2,1);
          transform-style: preserve-3d;
          border-radius: 12px;
        }
        .flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        .flashcard-front,
        .flashcard-back {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(16,24,40,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(6px) saturate(120%);
        }
        .flashcard-back {
          transform: rotateY(180deg);
        }

        /* small responsiveness */
        @media (max-width: 640px) {
          .flashcard {
            height: 220px;
          }
        }
      `}</style>
    </div>
  )
}
