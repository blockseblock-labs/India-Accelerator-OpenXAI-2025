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

  // Notes section states
  const [myNotes, setMyNotes] = useState('')
  // Export notes as txt file
  const exportNotes = () => {
    const blob = new Blob([myNotes], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my_notes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-3 tracking-tight">📚 LearnMate AI</h1>
          <p className="text-white/80 text-xl font-light">Your AI-powered study companion</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/30 backdrop-blur-xl shadow-lg rounded-full p-2 flex space-x-2">
            {[{ id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' }, { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' }, { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }, { id: 'notes', label: '🗒️ Notes', desc: 'Write & Export Notes' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold text-base ${activeTab === tab.id ? 'bg-white text-purple-700 shadow-xl scale-105' : 'text-white hover:bg-white/20 hover:text-purple-200'}`}
                tabIndex={0}
              >
                <div>{tab.label}</div>
                <div className="text-xs opacity-70 font-normal">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 transition-all">
              <h2 className="text-3xl font-bold text-purple-900 mb-6">🃏 Flashcard Maker</h2>
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="w-full h-40 p-4 rounded-xl border-0 bg-white/40 text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-300 shadow-md"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-purple-900 font-medium">
                    Card {currentCard + 1} of {flashcards.length}
                  </div>
                  <div
                    className={`mb-8 cursor-pointer group perspective-1000`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className={`relative w-full h-40 transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
                      style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute w-full h-full bg-white/80 rounded-xl shadow-lg flex items-center justify-center text-xl font-semibold text-purple-900 backface-hidden p-6" style={{ backfaceVisibility: 'hidden' }}>
                        {flashcards[currentCard]?.front}
                      </div>
                      <div className="absolute w-full h-full bg-purple-100 rounded-xl shadow-lg flex items-center justify-center text-xl font-semibold text-purple-900 rotate-y-180 backface-hidden p-6" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        {flashcards[currentCard]?.back}
                      </div>
                    </div>
                    <div className="text-center text-purple-400 mt-2 text-sm">Click card to flip</div>
                  </div>
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-6 py-3 bg-white/40 text-purple-700 rounded-xl font-semibold shadow disabled:opacity-50"
                    >Previous</button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-bold shadow-lg"
                    >New Flashcards</button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-6 py-3 bg-white/40 text-purple-700 rounded-xl font-semibold shadow disabled:opacity-50"
                    >Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 transition-all">
              <h2 className="text-3xl font-bold text-purple-900 mb-6">📝 Quiz Maker</h2>
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create a quiz for you..."
                    className="w-full h-40 p-4 rounded-xl border-0 bg-white/40 text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-300 shadow-md"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Quiz...' : 'Create Quiz'}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-4xl font-extrabold text-purple-900 mb-4">Quiz Complete!</h3>
                  <p className="text-2xl text-purple-700 mb-6">
                    You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg"
                  >Take Another Quiz</button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-purple-900 font-medium">
                    Question {currentQuestion + 1} of {quiz.length}
                  </div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-purple-900 mb-4">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    <div className="space-y-4">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 text-left rounded-xl font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedAnswer === null ? 'bg-white/40 text-purple-900 hover:bg-purple-100' : selectedAnswer === index ? index === quiz[currentQuestion].correct ? 'bg-green-400 text-white' : 'bg-red-400 text-white' : index === quiz[currentQuestion].correct ? 'bg-green-400 text-white' : 'bg-white/20 text-purple-400'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {selectedAnswer !== null && (
                      <div className="mt-6 p-4 bg-purple-100 rounded-xl shadow">
                        <p className="text-purple-900 font-bold mb-2">Explanation:</p>
                        <p className="text-purple-700 text-base">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 transition-all">
              <h2 className="text-3xl font-bold text-purple-900 mb-6">🤖 Ask-Me Study Buddy</h2>
              <div className="mb-8">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything you want to learn about..."
                    className="flex-1 p-4 rounded-xl border-0 bg-white/40 text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-300 shadow-md"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Thinking...' : 'Ask'}
                  </button>
                </div>
              </div>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-blue-400/20 p-4 rounded-xl shadow">
                      <p className="text-purple-900 font-bold">You:</p>
                      <p className="text-purple-700 text-base">{chat.question}</p>
                    </div>
                    <div className="bg-green-400/20 p-4 rounded-xl shadow">
                      <p className="text-purple-900 font-bold">Study Buddy:</p>
                      <p className="text-purple-700 text-base">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                {chatHistory.length === 0 && (
                  <div className="text-center text-purple-400 py-8">
                    Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions.
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 transition-all">
              <h2 className="text-3xl font-bold text-purple-900 mb-6">�️ My Notes</h2>
              <textarea
                value={myNotes}
                onChange={e => setMyNotes(e.target.value)}
                placeholder="Write your study notes here..."
                className="w-full h-64 p-4 rounded-xl border-0 bg-white/40 text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-300 shadow-md mb-6"
              />
              <div className="flex justify-end">
                <button
                  onClick={exportNotes}
                  disabled={!myNotes.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >Export as .txt</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 