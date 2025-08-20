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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #ffecd2 50%, #d299c2 75%, #fef9d7 100%)'
    }}>
      {/* Floating Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 35%, #45b7d1 70%, #96ceb4 100%)'
              }}>
                🧠
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">LearnAI</h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Assistant</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-4">
              {flashcards.length > 0 && activeTab === 'flashcards' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Progress:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                        background: 'linear-gradient(90deg, #ff9a9e 0%, #fad0c4 25%, #a8edea 50%, #fed6e3 75%, #ff9a9e 100%)'
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-700">{currentCard + 1}/{flashcards.length}</span>
                </div>
              )}
              {quiz.length > 0 && activeTab === 'quiz' && !showResults && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Quiz Progress:</span>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #fecfef 75%, #ff9a9e 100%)'
                    }}
                  >
                    {currentQuestion + 1}/{quiz.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation - Redesigned as Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              id: 'flashcards', 
              icon: '🃏', 
              title: 'Flashcards', 
              desc: 'Transform notes into interactive cards',
              color: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 70%, #f5576c 100%)'
            },
            { 
              id: 'quiz', 
              icon: '🎯', 
              title: 'Smart Quiz', 
              desc: 'Test knowledge with AI-generated questions',
              color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 25%, #43e97b 50%, #38f9d7 75%, #ffecd2 100%)'
            },
            { 
              id: 'study-buddy', 
              icon: '🤖', 
              title: 'Study Buddy', 
              desc: 'Get instant answers to your questions',
              color: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 35%, #45b7d1 70%, #96ceb4 100%)'
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'shadow-2xl ring-4 ring-white/50'
                  : 'hover:shadow-xl'
              }`}
              style={{
                background: activeTab === tab.id ? tab.color : 'rgba(255, 255, 255, 0.7)',
                color: activeTab === tab.id ? 'white' : '#374151'
              }}
            >
              <div className="text-4xl mb-3">{tab.icon}</div>
              <h3 className="text-xl font-bold mb-2">{tab.title}</h3>
              <p className={`text-sm ${activeTab === tab.id ? 'text-white/90' : 'text-gray-600'}`}>
                {tab.desc}
              </p>
              {activeTab === tab.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Input Your Notes</h2>
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your study notes here and I'll create interactive flashcards for you..."
                  className="w-full h-48 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                />
                
                <button
                  onClick={generateFlashcards}
                  disabled={loading || !notes.trim()}
                  className="w-full mt-4 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  style={{
                    background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {loading ? 'Generating Flashcards...' : 'Generate Flashcards ✨'}
                </button>
              </div>

              {/* Flashcard Display */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                {flashcards.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🃏</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to Create Flashcards!</h3>
                    <p className="text-gray-500">Add your notes and click generate to start learning</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Your Flashcards</h3>
                      <button
                        onClick={() => setFlashcards([])}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                    
                    <div 
                      className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer`}
                      onClick={() => setFlipped(!flipped)}
                    >
                      <div className="flashcard-inner">
                        <div className="flashcard-front">
                          <p className="text-lg font-medium">{flashcards[currentCard]?.front}</p>
                        </div>
                        <div className="flashcard-back">
                          <p className="text-lg">{flashcards[currentCard]?.back}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={prevCard}
                        disabled={currentCard === 0}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        ← Previous
                      </button>
                      
                      <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {currentCard + 1} of {flashcards.length}
                      </div>
                      
                      <button
                        onClick={nextCard}
                        disabled={currentCard === flashcards.length - 1}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="space-y-8">
              {quiz.length === 0 && !showResults ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                        ?
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Create Your Quiz</h2>
                    </div>
                    
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste your study material here and I'll create a comprehensive quiz for you..."
                      className="w-full h-48 p-4 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                    />
                    
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="w-full mt-4 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      style={{
                        background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)'
                      }}
                    >
                      {loading ? 'Creating Quiz...' : 'Generate Quiz 🎯'}
                    </button>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-bold text-gray-700 mb-2">Quiz Generator Ready!</h3>
                      <p className="text-gray-500">Add your content to create an interactive quiz</p>
                    </div>
                  </div>
                </div>
              ) : showResults ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
                  <div 
                    className="inline-block px-8 py-4 rounded-2xl text-white text-2xl font-bold mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #fecfef 75%, #ff9a9e 100%)'
                    }}
                  >
                    Score: {score}/{quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setQuiz([])
                        setShowResults(false)
                        setScore(0)
                      }}
                      className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors mr-4"
                    >
                      Create New Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Question {currentQuestion + 1}</h3>
                      <div 
                        className="px-4 py-2 rounded-full text-sm font-medium text-gray-800"
                        style={{
                          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)'
                        }}
                      >
                        {currentQuestion + 1} of {quiz.length}
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-700 mb-6 p-4 bg-gray-50 rounded-xl">
                      {quiz[currentQuestion]?.question}
                    </h4>
                    
                    <div className="grid gap-3">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 text-left rounded-xl transition-all quiz-option border-2 ${
                            selectedAnswer === null
                              ? 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'correct border-green-300'
                                : 'incorrect border-red-300'
                              : index === quiz[currentQuestion].correct
                              ? 'correct border-green-300'
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center text-sm font-bold">
                              {String.fromCharCode(65 + index)}
                            </div>
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                        <p className="font-medium text-blue-800 mb-2">Explanation:</p>
                        <p className="text-blue-700">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
              {/* Chat Area */}
              <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg mr-3">
                      🤖
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">AI Study Buddy</h2>
                      <p className="text-sm text-gray-500">Ask me anything!</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">💭</div>
                      <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to Help!</h3>
                      <p className="text-gray-500">Ask me any question and I'll provide detailed explanations</p>
                    </div>
                  ) : (
                    chatHistory.map((chat, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-end">
                          <div className="max-w-xs lg:max-w-md bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl rounded-tr-sm">
                            <p className="font-medium text-sm mb-1">You</p>
                            <p>{chat.question}</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="max-w-xs lg:max-w-md bg-gray-100 p-4 rounded-2xl rounded-tl-sm">
                            <p className="font-medium text-sm mb-1 text-purple-600">Study Buddy</p>
                            <p className="text-gray-800">{chat.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything you want to learn..."
                      className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                    />
                    <button
                      onClick={askStudyBuddy}
                      disabled={loading || !question.trim()}
                      className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50"
                      style={{
                        background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {loading ? '💭' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar with Tips */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Study Tips</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">Ask for examples to better understand concepts</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm text-green-800">Request step-by-step explanations for complex topics</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <p className="text-sm text-purple-800">Ask for practice problems to test your knowledge</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <p className="text-sm text-orange-800">Request analogies to relate new concepts to familiar ones</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">🎯 Quick Actions</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setQuestion("Explain this concept with an example")}
                      className="w-full text-left text-sm text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      → Ask for examples
                    </button>
                    <button 
                      onClick={() => setQuestion("Give me a practice problem")}
                      className="w-full text-left text-sm text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      → Get practice problems
                    </button>
                    <button 
                      onClick={() => setQuestion("Summarize the key points")}
                      className="w-full text-left text-sm text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      → Request summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}