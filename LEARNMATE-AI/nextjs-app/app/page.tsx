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
  const [chatHistory, setChatHistory] = useState<{ question: string, answer: string }[]>([])

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
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">📚 LearnAI</h1>
          <p className="text-white/80 text-lg font-medium">AI-Powered Educational Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex space-x-2 shadow-lg">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-xl transition-all duration-200 flex flex-col items-center focus:outline-none ${
                  activeTab === tab.id
                    ? 'bg-white/80 text-indigo-700 shadow-xl scale-105'
                    : 'text-white/90 hover:bg-white/20'
                }`}
              >
                <span className="text-lg font-semibold">{tab.label}</span>
                <span className="text-xs opacity-70">{tab.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">🃏 Flashcard Maker</h2>
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="w-full h-40 p-4 rounded-xl border-0 bg-white/40 text-indigo-900 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-300 shadow-inner resize-none transition"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-indigo-900 text-center font-medium">
                    Card {currentCard + 1} of {flashcards.length}
                  </div>
                  <div
                    className={`relative mx-auto mb-8 w-80 h-48 perspective cursor-pointer`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className={`absolute w-full h-full transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute w-full h-full bg-white/90 rounded-2xl flex items-center justify-center shadow-xl text-indigo-800 text-xl font-semibold backface-hidden p-6">
                        {flashcards[currentCard]?.front}
                      </div>
                      <div className="absolute w-full h-full bg-indigo-600/90 rounded-2xl flex items-center justify-center shadow-xl text-white text-lg font-medium rotate-y-180 backface-hidden p-6">
                        {flashcards[currentCard]?.back}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-5 py-2 bg-white/40 text-indigo-700 rounded-lg font-medium shadow transition disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow"
                    >
                      New Flashcards
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-5 py-2 bg-white/40 text-indigo-700 rounded-lg font-medium shadow transition disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">📝 Quiz Maker</h2>
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create a quiz for you..."
                    className="w-full h-40 p-4 rounded-xl border-0 bg-white/40 text-indigo-900 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-300 shadow-inner resize-none transition"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-6 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Quiz...' : 'Create Quiz'}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-indigo-900 mb-4">Quiz Complete!</h3>
                  <p className="text-xl text-indigo-800 mb-6">
                    You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow"
                  >
                    Take Another Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-indigo-900 text-center font-medium">
                    Question {currentQuestion + 1} of {quiz.length}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 text-left rounded-xl transition-all duration-200 font-medium shadow quiz-option ${
                            selectedAnswer === null
                              ? 'bg-white/40 text-indigo-900 hover:bg-white/60'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : index === quiz[currentQuestion].correct
                              ? 'bg-green-500 text-white'
                              : 'bg-white/20 text-indigo-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {selectedAnswer !== null && (
                      <div className="mt-4 p-4 bg-white/40 rounded-xl shadow">
                        <p className="text-indigo-900 font-semibold mb-1">Explanation:</p>
                        <p className="text-indigo-800">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">🤖 Ask-Me Study Buddy</h2>
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything you want to learn about..."
                    className="flex-1 p-4 rounded-xl border-0 bg-white/40 text-indigo-900 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-300 shadow-inner transition"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Thinking...' : 'Ask'}
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-blue-500/20 p-4 rounded-xl shadow">
                      <p className="text-indigo-900 font-semibold">You:</p>
                      <p className="text-indigo-800">{chat.question}</p>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-xl shadow">
                      <p className="text-indigo-900 font-semibold">Study Buddy:</p>
                      <p className="text-indigo-800">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                {chatHistory.length === 0 && (
                  <div className="text-center text-indigo-400 py-8">
                    Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .perspective {
          perspective: 1200px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}