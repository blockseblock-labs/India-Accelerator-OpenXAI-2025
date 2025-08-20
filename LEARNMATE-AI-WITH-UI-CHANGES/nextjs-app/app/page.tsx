'use client'

import { useState } from 'react'
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

  // --- API functions ---
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
    if (answerIndex === quiz[currentQuestion].correct) setScore(score + 1)
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col space-y-4 col-span-1"
        >
          <h1 className="text-3xl font-extrabold text-white mb-4">📚 LearnAI</h1>
          {[
            { id: 'flashcards', label: '🃏 Flashcards' },
            { id: 'quiz', label: '📝 Quiz' },
            { id: 'study-buddy', label: '🤖 Study Buddy' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-3 text-left rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-600 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.aside>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="col-span-3 bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl min-h-[70vh] overflow-y-auto"
          >
            {/* Flashcards */}
            {activeTab === 'flashcards' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">🃏 Flashcard Maker</h2>
                {flashcards.length === 0 ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your notes here..."
                      className="w-full h-40 p-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-300"
                    />
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Generating...' : 'Generate Flashcards'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-white">Card {currentCard + 1} of {flashcards.length}</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={flipped ? 'back' : 'front'}
                        initial={{ opacity: 0, x: flipped ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: flipped ? -50 : 50 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-48 mb-6 bg-white rounded-2xl flex items-center justify-center p-6 shadow-lg cursor-pointer"
                        onClick={() => setFlipped(!flipped)}
                      >
                        <p className="text-lg font-medium text-emerald-700">
                          {flipped ? flashcards[currentCard]?.back : flashcards[currentCard]?.front}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-between">
                      <button onClick={prevCard} disabled={currentCard === 0} className="px-4 py-2 bg-white/20 text-white rounded-xl disabled:opacity-40">Previous</button>
                      <button onClick={() => setFlashcards([])} className="px-4 py-2 bg-red-500 text-white rounded-xl">New</button>
                      <button onClick={nextCard} disabled={currentCard === flashcards.length - 1} className="px-4 py-2 bg-white/20 text-white rounded-xl disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz */}
            {activeTab === 'quiz' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">📝 Quiz Maker</h2>
                {quiz.length === 0 && !showResults ? (
                  <div>
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste text to create a quiz..."
                      className="w-full h-40 p-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-300"
                    />
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Creating Quiz...' : 'Create Quiz'}
                    </button>
                  </div>
                ) : showResults ? (
                  <div className="text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">Quiz Complete!</h3>
                    <p className="text-xl mb-6">You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)</p>
                    <button onClick={() => { setQuiz([]); setShowResults(false); setScore(0) }} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">Try Again</button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-white">Question {currentQuestion + 1} of {quiz.length}</div>
                    <h3 className="text-xl font-semibold text-white mb-4">{quiz[currentQuestion]?.question}</h3>
                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 rounded-xl transition-all text-left ${
                            selectedAnswer === null
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'bg-emerald-500 text-white'
                                : 'bg-red-500 text-white'
                              : index === quiz[currentQuestion].correct
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {selectedAnswer !== null && (
                      <div className="mt-4 p-4 bg-white/20 rounded-xl text-white">
                        <p className="font-semibold mb-1">Explanation:</p>
                        <p>{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Study Buddy */}
            {activeTab === 'study-buddy' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">🤖 Ask-Me Study Buddy</h2>
                <div className="flex space-x-3 mb-6">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 p-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-300"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Thinking...' : 'Ask'}
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-emerald-500/20 p-4 rounded-xl text-white">
                        <p className="font-semibold">You:</p>
                        <p>{chat.question}</p>
                      </div>
                      <div className="bg-cyan-500/20 p-4 rounded-xl text-white">
                        <p className="font-semibold">Study Buddy:</p>
                        <p>{chat.answer}</p>
                      </div>
                    </div>
                  ))}
                  {chatHistory.length === 0 && (
                    <div className="text-center text-white/60 py-10">Ask me anything and I'll help you learn! ✨</div>
                  )}
                </div>
              </div>
            )}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}