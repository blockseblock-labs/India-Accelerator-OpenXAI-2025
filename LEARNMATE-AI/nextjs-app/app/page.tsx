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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-blue-400 rounded-full opacity-20 animate-pulse animation-delay-700"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-pink-400 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            LearnAI
          </h1>
          <p className="text-white/70 text-xl font-light max-w-2xl mx-auto">
            Supercharge your learning with AI-powered educational tools designed for modern students
          </p>
          <div className="flex justify-center space-x-8 mt-6 text-sm text-white/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Smart Flashcards</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-300"></div>
              <span>Dynamic Quizzes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-700"></div>
              <span>AI Study Buddy</span>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex space-x-2 shadow-2xl">
            {[
              { id: 'flashcards', label: '🎴 Flashcards', desc: 'Create & Study', gradient: 'from-blue-500 to-cyan-500' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Test Knowledge', gradient: 'from-green-500 to-emerald-500' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask AI Anything', gradient: 'from-purple-500 to-pink-500' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl scale-105`
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="text-lg font-semibold">{tab.label}</div>
                <div className="text-xs opacity-75 font-light">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl">🎴</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Smart Flashcards</h2>
                  <p className="text-white/60 font-light">Transform your notes into interactive flashcards</p>
                </div>
              </div>
              
              {flashcards.length === 0 ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your study notes here and watch AI transform them into perfect flashcards..."
                      className="w-full h-48 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 resize-none text-lg"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {notes.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Generating Magic...</span>
                        </>
                      ) : (
                        <>
                          <span>✨ Generate Flashcards</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 font-medium text-lg">
                      Card {currentCard + 1} of {flashcards.length}
                    </div>
                    <div className="flex space-x-2">
                      {flashcards.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentCard ? 'bg-blue-400 w-8' : 'bg-white/20 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} cursor-pointer group`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/20 rounded-3xl shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="absolute top-6 right-6 text-white/40 text-sm font-light">
                          Click to reveal
                        </div>
                        <p className="text-xl font-medium text-white leading-relaxed">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className="flashcard-back bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/20 rounded-3xl shadow-2xl">
                        <p className="text-xl text-white leading-relaxed">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl disabled:opacity-30 transition-all duration-300 border border-white/10 font-medium"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        setFlashcards([])
                        setNotes('')
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                    >
                      🗂️ New Set
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl disabled:opacity-30 transition-all duration-300 border border-white/10 font-medium"
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
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Smart Quiz</h2>
                  <p className="text-white/60 font-light">Test your knowledge with AI-generated questions</p>
                </div>
              </div>
              
              {quiz.length === 0 && !showResults ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste your study material here and I'll create challenging quiz questions..."
                      className="w-full h-48 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-white/40 focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 resize-none text-lg"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {quizText.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating Quiz...</span>
                        </>
                      ) : (
                        <>
                          <span>🎯 Create Quiz</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center space-y-8">
                  <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                    <span className="text-6xl">
                      {score / quiz.length >= 0.8 ? '🏆' : score / quiz.length >= 0.6 ? '🎉' : '📚'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h3>
                    <div className="text-6xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-4">
                      {Math.round((score / quiz.length) * 100)}%
                    </div>
                    <p className="text-xl text-white/80 mb-8">
                      You scored {score} out of {quiz.length} questions correctly
                    </p>
                    <div className="w-full bg-white/10 rounded-full h-4 mb-8 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(score / quiz.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                      setQuizText('')
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    🎯 Take Another Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 font-medium text-lg">
                      Question {currentQuestion + 1} of {quiz.length}
                    </div>
                    <div className="flex space-x-2">
                      {quiz.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentQuestion ? 'bg-green-400 w-8' : 'bg-white/20 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="grid gap-4">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`p-6 text-left rounded-2xl transition-all duration-300 transform hover:scale-102 quiz-option ${
                            selectedAnswer === null
                              ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl scale-102'
                                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl scale-102'
                              : index === quiz[currentQuestion].correct
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl'
                              : 'bg-white/5 text-white/40 border border-white/5'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              selectedAnswer === null ? 'bg-white/10' : 
                              selectedAnswer === index 
                                ? index === quiz[currentQuestion].correct ? 'bg-white/20' : 'bg-white/20'
                                : index === quiz[currentQuestion].correct ? 'bg-white/20' : 'bg-white/5'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-lg font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💡</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold mb-2">Explanation:</p>
                            <p className="text-white/90 leading-relaxed">{quiz[currentQuestion]?.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">AI Study Buddy</h2>
                  <p className="text-white/60 font-light">Your personal AI tutor, ready to help 24/7</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything... concepts, examples, explanations..."
                    className="flex-1 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span>Ask 🚀</span>
                    )}
                  </button>
                </div>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-end">
                        <div className="max-w-4xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/20 p-6 rounded-3xl rounded-br-lg shadow-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-sm font-bold text-white">You</span>
                            </div>
                            <span className="text-white/60 text-sm font-light">Just now</span>
                          </div>
                          <p className="text-white font-medium leading-relaxed">{chat.question}</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-4xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/20 p-6 rounded-3xl rounded-bl-lg shadow-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-lg">🤖</span>
                            </div>
                            <span className="text-white font-semibold">Study Buddy</span>
                            <span className="text-white/60 text-sm font-light">Just now</span>
                          </div>
                          <p className="text-white/90 leading-relaxed">{chat.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <span className="text-5xl">💭</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Ready to Learn Together?</h3>
                      <p className="text-white/60 max-w-lg mx-auto mb-8 font-light">
                        I'm your AI study companion! Ask me to explain concepts, provide examples, solve problems, or help with any topic you're studying.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {[
                          { icon: '📚', text: 'Explain concepts', color: 'from-blue-500 to-cyan-500' },
                          { icon: '💡', text: 'Provide examples', color: 'from-green-500 to-emerald-500' },
                          { icon: '🧮', text: 'Solve problems', color: 'from-purple-500 to-pink-500' }
                        ].map((item, idx) => (
                          <div key={idx} className={`p-6 bg-gradient-to-r ${item.color}/10 border border-white/10 rounded-2xl text-center hover:bg-gradient-to-r hover:${item.color}/20 transition-all duration-300 cursor-pointer transform hover:scale-105`}>
                            <div className="text-3xl mb-3">{item.icon}</div>
                            <div className="text-white/80 font-medium">{item.text}</div>
                          </div>
                        ))}
                      </div>
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