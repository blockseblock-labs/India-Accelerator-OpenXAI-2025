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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            LearnAI
          </h1>
          <p className="text-purple-200 text-xl">Intelligent Learning Companion</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-black bg-opacity-30 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-2 shadow-2xl">
            <div className="flex space-x-1">
              {[
                { id: 'flashcards', icon: '💡', label: 'Flashcards', desc: 'Smart Cards' },
                { id: 'quiz', icon: '🎯', label: 'Quiz', desc: 'Test Knowledge' },
                { id: 'study-buddy', icon: '🤖', label: 'AI Tutor', desc: 'Ask Anything' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20 border border-blue-400 border-opacity-30 shadow-lg'
                      : 'hover:bg-white hover:bg-opacity-5 border border-transparent'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-2xl">{tab.icon}</span>
                    <span className={`text-sm font-semibold ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-300'
                    }`}>
                      {tab.label}
                    </span>
                    <span className={`text-xs ${
                      activeTab === tab.id ? 'text-blue-300' : 'text-gray-500'
                    }`}>
                      {tab.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-black bg-opacity-20 backdrop-blur-lg border border-white border-opacity-10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Smart Flashcards</h2>
                  <p className="text-gray-400">AI-generated study cards from your notes</p>
                </div>
              </div>
              
              {flashcards.length === 0 ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="✨ Paste your study material here and watch AI create perfect flashcards..."
                      className="w-full h-48 p-6 rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-50 transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                      {notes.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                        <span>Generating Flashcards...</span>
                      </div>
                    ) : (
                      '✨ Generate Smart Flashcards'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="bg-white bg-opacity-10 px-4 py-2 rounded-full">
                      <span className="text-white font-medium">
                        Card {currentCard + 1} of {flashcards.length}
                      </span>
                    </div>
                    <div className="w-64 bg-white bg-opacity-10 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div 
                    className="relative w-full h-80 cursor-pointer"
                    onClick={() => setFlipped(!flipped)}
                    style={{ perspective: '1000px' }}
                  >
                    <div 
                      className="relative w-full h-full transition-transform duration-700"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front of card */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-blue-500 from-opacity-20 to-purple-500 to-opacity-20 border border-white border-opacity-20 rounded-3xl p-8 flex items-center justify-center shadow-2xl"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-4">🤔</div>
                          <p className="text-xl font-medium text-white leading-relaxed">
                            {flashcards[currentCard]?.front}
                          </p>
                          <p className="text-gray-400 mt-4 text-sm">Click to reveal answer</p>
                        </div>
                      </div>
                      
                      {/* Back of card */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-green-500 from-opacity-20 to-blue-500 to-opacity-20 border border-white border-opacity-20 rounded-3xl p-8 flex items-center justify-center shadow-2xl"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-4">💡</div>
                          <p className="text-xl font-medium text-white leading-relaxed">
                            {flashcards[currentCard]?.back}
                          </p>
                          <p className="text-gray-400 mt-4 text-sm">Click to flip back</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span>←</span>
                      <span>Previous</span>
                    </button>
                    
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg"
                    >
                      🔄 New Set
                    </button>
                    
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span>Next</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-black bg-opacity-20 backdrop-blur-lg border border-white border-opacity-10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Interactive Quiz</h2>
                  <p className="text-gray-400">Test your knowledge with AI-generated questions</p>
                </div>
              </div>
              
              {quiz.length === 0 && !showResults ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="🎯 Enter your study material and I'll create a challenging quiz..."
                      className="w-full h-48 p-6 rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-5 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500 focus:border-opacity-50 transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                      {quizText.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Quiz...</span>
                      </div>
                    ) : (
                      '🎯 Create Interactive Quiz'
                    )}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center space-y-8">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-4xl font-bold text-white">Quiz Complete!</h3>
                  <div className="bg-gradient-to-r from-blue-500 from-opacity-20 to-purple-500 to-opacity-20 border border-white border-opacity-20 rounded-3xl p-8">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                      {Math.round((score / quiz.length) * 100)}%
                    </div>
                    <p className="text-xl text-white mb-2">
                      {score} out of {quiz.length} correct
                    </p>
                    <p className="text-gray-400">
                      {score === quiz.length ? 'Perfect score! 🌟' : 
                       score >= quiz.length * 0.8 ? 'Excellent work! 🎊' :
                       score >= quiz.length * 0.6 ? 'Good job! 👏' : 'Keep studying! 💪'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl font-semibold text-lg transition-all shadow-xl"
                  >
                    🔄 Take Another Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="bg-white bg-opacity-10 px-4 py-2 rounded-full">
                      <span className="text-white font-medium">
                        Question {currentQuestion + 1} of {quiz.length}
                      </span>
                    </div>
                    <div className="w-64 bg-white bg-opacity-10 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 from-opacity-10 to-purple-500 to-opacity-10 border border-white border-opacity-20 rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-4">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-5 text-left rounded-2xl transition-all duration-300 border ${
                            selectedAnswer === null
                              ? 'bg-white bg-opacity-5 border-white border-opacity-10 text-white hover:bg-opacity-10 hover:border-opacity-20'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'bg-green-500 bg-opacity-20 border-green-500 border-opacity-50 text-white'
                                : 'bg-red-500 bg-opacity-20 border-red-500 border-opacity-50 text-white'
                              : index === quiz[currentQuestion].correct
                              ? 'bg-green-500 bg-opacity-20 border-green-500 border-opacity-50 text-white'
                              : 'bg-white bg-opacity-5 border-white border-opacity-10 text-white text-opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              selectedAnswer === null
                                ? 'bg-white bg-opacity-20 text-white'
                                : selectedAnswer === index
                                ? index === quiz[currentQuestion].correct
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                                : index === quiz[currentQuestion].correct
                                ? 'bg-green-500 text-white'
                                : 'bg-white bg-opacity-10 text-white text-opacity-60'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-8 p-6 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">💡</div>
                          <div>
                            <p className="text-white font-semibold mb-2">Explanation:</p>
                            <p className="text-gray-300 leading-relaxed">{quiz[currentQuestion]?.explanation}</p>
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
            <div className="bg-black bg-opacity-20 backdrop-blur-lg border border-white border-opacity-10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">AI Learning Companion</h2>
                  <p className="text-gray-400">Get instant answers to any study question</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="💭 Ask me anything you want to learn about..."
                      className="w-full p-4 pr-12 rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-5 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:border-opacity-50 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ✨
                    </div>
                  </div>
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl whitespace-nowrap"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                        <span>Thinking</span>
                      </div>
                    ) : (
                      'Ask AI'
                    )}
                  </button>
                </div>

                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-end">
                        <div className="max-w-3xl bg-gradient-to-r from-blue-500 from-opacity-20 to-purple-500 to-opacity-20 border border-white border-opacity-20 p-5 rounded-3xl rounded-br-lg">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">👤</div>
                            <div>
                              <p className="text-blue-300 font-medium text-sm mb-1">You asked:</p>
                              <p className="text-white leading-relaxed">{chat.question}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-3xl bg-gradient-to-r from-green-500 from-opacity-20 to-blue-500 to-opacity-20 border border-white border-opacity-20 p-5 rounded-3xl rounded-bl-lg">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">🤖</div>
                            <div>
                              <p className="text-green-300 font-medium text-sm mb-1">AI Tutor:</p>
                              <p className="text-white leading-relaxed">{chat.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3 className="text-2xl font-bold text-white mb-4">Hi there! I'm your AI Learning Companion</h3>
                      <p className="text-gray-400 leading-relaxed max-w-md mx-auto">
                        Ask me anything you want to learn about! I can explain concepts, solve problems, 
                        provide examples, and help you understand complex topics.
                      </p>
                      <div className="flex justify-center space-x-4 mt-8 text-gray-500">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📚</div>
                          <div className="text-xs">Study Help</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">💡</div>
                          <div className="text-xs">Explanations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🔍</div>
                          <div className="text-xs">Examples</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🧮</div>
                          <div className="text-xs">Problem Solving</div>
                        </div>
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
