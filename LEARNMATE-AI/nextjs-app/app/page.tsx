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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <h1 className="text-6xl font-bold text-white">📚</h1>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            LearnAI
          </h1>
          <p className="text-white/90 text-xl font-medium">AI-Powered Educational Tools for Smart Learning</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 flex space-x-1 shadow-2xl border border-white/20">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Create Smart Cards', icon: '✨' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Generate Tests', icon: '🎯' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'AI Assistant', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-1">{tab.icon}</div>
                <div className="text-sm font-semibold">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">🃏 Flashcard Maker</h2>
                <p className="text-white/80 text-lg">Transform your notes into interactive learning cards</p>
              </div>
              
              {flashcards.length === 0 ? (
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your study notes here and I'll create intelligent flashcards for you... ✨"
                      className="w-full h-48 p-6 rounded-2xl border-0 bg-white/15 text-white placeholder-white/60 focus:ring-4 focus:ring-blue-400/50 focus:bg-white/20 transition-all duration-300 text-lg resize-none"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {notes.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Generating Smart Flashcards...</span>
                      </div>
                    ) : (
                      '🚀 Generate Flashcards'
                    )}
                  </button>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold">
                      <span>✨</span>
                      <span>Generated {flashcards.length} Smart Flashcards</span>
                    </div>
                  </div>
                  
                  <div className="mb-8 text-center text-white/80">
                    <span className="text-2xl font-bold text-white">{currentCard + 1}</span>
                    <span className="mx-2">/</span>
                    <span>{flashcards.length}</span>
                  </div>
                  
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} mb-8 cursor-pointer transform hover:scale-105 transition-transform duration-300`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl border-4 border-white/20">
                        <p className="text-2xl font-semibold text-white leading-relaxed">{flashcards[currentCard]?.front}</p>
                        <div className="mt-4 text-center text-white/70 text-sm">
                          Click to reveal answer
                        </div>
                      </div>
                      <div className="flashcard-back bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 shadow-2xl border-4 border-white/20">
                        <p className="text-xl text-white leading-relaxed">{flashcards[currentCard]?.back}</p>
                        <div className="mt-4 text-center text-white/70 text-sm">
                          Click to see question
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      ← Previous
                    </button>
                    
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      🆕 New Flashcards
                    </button>
                    
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
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
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">📝 Quiz Maker</h2>
                <p className="text-white/80 text-lg">Turn any text into an engaging quiz</p>
              </div>
              
              {quiz.length === 0 && !showResults ? (
                <div className="max-w-3xl mx-auto">
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create an intelligent quiz for you... 🎯"
                    className="w-full h-48 p-6 rounded-2xl border-0 bg-white/15 text-white placeholder-white/60 focus:ring-4 focus:ring-green-400/50 focus:bg-white/20 transition-all duration-300 text-lg resize-none"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Smart Quiz...</span>
                      </div>
                    ) : (
                      '🎯 Create Quiz'
                    )}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h3>
                  <div className="bg-white/10 rounded-2xl p-6 mb-8">
                    <p className="text-2xl text-white mb-2">
                      You scored <span className="text-yellow-400 font-bold">{score}</span> out of <span className="text-blue-400 font-bold">{quiz.length}</span>
                    </p>
                    <p className="text-xl text-white/80">
                      ({Math.round((score / quiz.length) * 100)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    🚀 Take Another Quiz
                  </button>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold">
                      <span>🎯</span>
                      <span>Question {currentQuestion + 1} of {quiz.length}</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center leading-relaxed">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-4">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-5 text-left rounded-2xl transition-all duration-300 transform hover:scale-102 ${
                            selectedAnswer === null
                              ? 'bg-white/15 text-white hover:bg-white/25 hover:shadow-lg'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                                : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl scale-105'
                              : index === quiz[currentQuestion].correct
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              selectedAnswer === null
                                ? 'bg-white/20'
                                : selectedAnswer === index
                                ? index === quiz[currentQuestion].correct
                                  ? 'bg-white'
                                  : 'bg-white'
                                : index === quiz[currentQuestion].correct
                                ? 'bg-white'
                                : 'bg-white/20'
                            }`}>
                              <span className={selectedAnswer === null
                                ? 'text-white'
                                : selectedAnswer === index
                                ? index === quiz[currentQuestion].correct
                                  ? 'text-green-600'
                                  : 'text-red-600'
                                : index === quiz[currentQuestion].correct
                                ? 'text-green-600'
                                : 'text-white/60'
                              }>
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>
                            <span className="text-lg">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20">
                        <p className="text-white font-semibold text-lg mb-2">💡 Explanation:</p>
                        <p className="text-white/90 text-lg">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">🤖 AI Study Buddy</h2>
                <p className="text-white/80 text-lg">Your personal AI tutor for any subject</p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything you want to learn about... 💭"
                      className="flex-1 p-5 rounded-2xl border-0 bg-white/15 text-white placeholder-white/60 focus:ring-4 focus:ring-purple-400/50 focus:bg-white/20 transition-all duration-300 text-lg"
                      onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                    />
                    <button
                      onClick={askStudyBuddy}
                      disabled={loading || !question.trim()}
                      className="px-8 py-5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Thinking...</span>
                        </div>
                      ) : (
                        '🚀 Ask'
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-3">
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-5 rounded-2xl border border-blue-400/30">
                        <p className="text-blue-300 font-semibold text-lg mb-2">👤 You:</p>
                        <p className="text-white/90 text-lg">{chat.question}</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-5 rounded-2xl border border-green-400/30">
                        <p className="text-green-300 font-semibold text-lg mb-2">🤖 Study Buddy:</p>
                        <p className="text-white/90 text-lg leading-relaxed">{chat.answer}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center text-white/60 py-12">
                      <div className="text-6xl mb-4">💡</div>
                      <p className="text-xl">Ask me anything and I'll help you learn!</p>
                      <p className="text-lg opacity-75">I can explain concepts, provide examples, and answer your questions.</p>
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