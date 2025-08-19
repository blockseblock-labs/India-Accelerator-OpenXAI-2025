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

  // ===== API FUNCTIONS =====
  const generateFlashcards = async () => {
    if (!notes.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })
      const data = await res.json()
      if (data.flashcards) {
        setFlashcards(data.flashcards)
        setCurrentCard(0)
        setFlipped(false)
      }
    } catch (err) {
      console.error('Error generating flashcards:', err)
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
        body: JSON.stringify({ text: quizText })
      })
      const data = await res.json()
      if (data.quiz) {
        setQuiz(data.quiz)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResults(false)
        setScore(0)
      }
    } catch (err) {
      console.error('Error generating quiz:', err)
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
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      if (data.answer) {
        const newChat = { question, answer: data.answer }
        setChatHistory(prev => [...prev, newChat])
        setAnswer(data.answer)
        setQuestion('')
      }
    } catch (err) {
      console.error('Error asking study buddy:', err)
    }
    setLoading(false)
  }

  // ===== Helpers =====
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
  const selectAnswer = (index: number) => {
    setSelectedAnswer(index)
    if (index === quiz[currentQuestion].correct) setScore(score + 1)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            LearnMate AI
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Your AI-powered study companion — Create Flashcards, Practice Quizzes, and Chat with a Study Buddy.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 flex space-x-3 shadow-lg">
            {[
              { id: 'flashcards', label: 'Flashcards' },
              { id: 'quiz', label: 'Quiz' },
              { id: 'study-buddy', label: 'Study Buddy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-xl'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Flashcard Maker</h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your notes here and I'll create flashcards..."
                    className="w-full h-40 p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-4 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-white">
                    Card {currentCard + 1} of {flashcards.length}
                  </p>
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer bg-white/90 p-6 rounded-lg shadow-md`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    {!flipped ? (
                      <p className="text-lg font-medium text-gray-800">{flashcards[currentCard]?.front}</p>
                    ) : (
                      <p className="text-lg text-gray-700">{flashcards[currentCard]?.back}</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button onClick={prevCard} disabled={currentCard === 0}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50">Previous</button>
                    <button onClick={() => setFlashcards([])}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg">New</button>
                    <button onClick={nextCard} disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz */}
          {activeTab === 'quiz' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Quiz Maker</h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste your text and I'll create a quiz..."
                    className="w-full h-40 p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-4 px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-semibold rounded-lg shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Creating Quiz...' : 'Create Quiz'}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">🎉 Quiz Complete!</h3>
                  <p className="text-xl text-white mb-6">
                    You scored {score} / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => { setQuiz([]); setShowResults(false); setScore(0); }}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-white">Question {currentQuestion + 1} of {quiz.length}</p>
                  <h3 className="text-xl font-bold text-white mb-4">{quiz[currentQuestion]?.question}</h3>
                  <div className="space-y-3">
                    {quiz[currentQuestion]?.options.map((opt, i) => (
                      <button key={i} onClick={() => selectAnswer(i)} disabled={selectedAnswer !== null}
                        className={`w-full p-4 rounded-lg transition-all ${
                          selectedAnswer === null
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : selectedAnswer === i
                            ? i === quiz[currentQuestion].correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            : i === quiz[currentQuestion].correct ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedAnswer !== null && (
                    <div className="mt-4 p-4 bg-white/20 rounded-lg">
                      <p className="text-white font-medium">Explanation:</p>
                      <p className="text-white/90">{quiz[currentQuestion]?.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Study Buddy */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Study Buddy Chat</h2>
              <div className="flex space-x-2 mb-6">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  className="flex-1 p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40"
                />
                <button
                  onClick={askStudyBuddy}
                  disabled={loading || !question.trim()}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? 'Thinking...' : 'Ask'}
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.length === 0 && (
                  <p className="text-center text-white/60">Start chatting with your AI buddy!</p>
                )}
                {chatHistory.map((c, i) => (
                  <div key={i}>
                    <div className="bg-blue-500/30 p-4 rounded-lg mb-2">
                      <p className="font-semibold text-white">You:</p>
                      <p className="text-white/90">{c.question}</p>
                    </div>
                    <div className="bg-green-500/30 p-4 rounded-lg">
                      <p className="font-semibold text-white">Buddy:</p>
                      <p className="text-white/90">{c.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
