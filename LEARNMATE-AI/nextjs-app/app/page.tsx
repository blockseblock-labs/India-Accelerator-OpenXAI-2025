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

  // ---- API Calls ----
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

  // ---- Navigation ----
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeSlideUp">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">📚 LearnAI</h1>
          <p className="text-white/80 text-lg">AI-Powered Educational Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex space-x-3 shadow-lg">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-700 shadow-xl'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <div className="text-sm font-semibold">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">🃏 Flashcard Maker</h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here..."
                    className="w-full h-40 p-4 rounded-xl border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transform text-white rounded-xl font-semibold shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? '✨ Generating...' : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-white">Card {currentCard + 1} of {flashcards.length}</p>
                  
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} mb-8 mx-auto w-80 h-52`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front flex items-center justify-center">
                        <p className="text-lg font-semibold">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className="flashcard-back flex items-center justify-center">
                        <p className="text-lg">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-40"
                    >
                      ⬅ Previous
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
                    >
                      🔄 New Flashcards
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-40"
                    >
                      Next ➡
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz */}
          {activeTab === 'quiz' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">📝 Quiz Maker</h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here..."
                    className="w-full h-40 p-4 rounded-xl border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105 transform text-white rounded-xl font-semibold shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? '⚡ Creating...' : 'Create Quiz'}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">🎉 Quiz Complete!</h3>
                  <p className="text-xl text-white mb-6">
                    You scored {score} / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([]); setShowResults(false); setScore(0)
                    }}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg"
                  >
                    🔄 Take Another Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-4 text-white">Question {currentQuestion + 1} of {quiz.length}</p>
                  <h3 className="text-xl font-semibold text-white mb-6">
                    {quiz[currentQuestion]?.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {quiz[currentQuestion]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-4 rounded-xl text-left transition quiz-option ${
                          selectedAnswer === null
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : selectedAnswer === index
                            ? index === quiz[currentQuestion].correct ? 'correct' : 'incorrect'
                            : index === quiz[currentQuestion].correct ? 'correct' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="mt-6 p-4 bg-white/20 rounded-xl">
                      <p className="text-white font-semibold">💡 Explanation:</p>
                      <p className="text-white/90">{quiz[currentQuestion]?.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Study Buddy */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">🤖 Study Buddy</h2>
              
              <div className="flex mb-6 space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 p-4 rounded-xl border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400"
                  onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                />
                <button
                  onClick={askStudyBuddy}
                  disabled={loading || !question.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transform text-white rounded-xl font-semibold shadow-lg transition disabled:opacity-50"
                >
                  {loading ? '🤔 Thinking...' : 'Ask'}
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2 animate-fadeSlideUp">
                    <div className="bg-blue-500/30 p-4 rounded-xl self-end">
                      <p className="text-white font-semibold">You:</p>
                      <p className="text-white/90">{chat.question}</p>
                    </div>
                    <div className="bg-green-500/30 p-4 rounded-xl">
                      <p className="text-white font-semibold">Buddy:</p>
                      <p className="text-white/90">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                
                {chatHistory.length === 0 && (
                  <div className="text-center text-white/60 py-8">
                    Start by asking me a question — I’ll explain, give examples, and help you study 📖
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
