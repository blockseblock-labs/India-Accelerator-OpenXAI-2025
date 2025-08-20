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

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.15s]"></div>
    </div>
  )
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📚 LearnAI</h1>
          <p className="text-white/80 text-lg">AI-Powered Educational Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 backdrop-blur-md text-white shadow-xl scale-105 ring-2 ring-purple-400/40'
                    : 'text-white/80 hover:bg-white/10 hover:shadow-lg hover:scale-105 hover:ring-1 hover:ring-purple-300/20'
                }`}
              >
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🃏 Flashcard Maker</h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:ring-4 focus:ring-purple-400/50 transition-all duration-300"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 
             text-white font-semibold rounded-xl shadow-lg 
             hover:scale-105 hover:shadow-xl transition-transform duration-300 
             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <LoadingSpinner /> : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-white">
                    Card {currentCard + 1} of {flashcards.length}
                  </div>
                  
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer w-full max-w-md mx-auto`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner shadow-2xl rounded-xl flashcard-gradient">
                      <div className="flashcard-front">
                        <p className="text-xl font-bold">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className="flashcard-back">
                        <p className="text-lg">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 
               text-white font-semibold rounded-xl shadow-lg 
               hover:scale-105 hover:shadow-xl transition-transform duration-300 
               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 
               text-white font-semibold rounded-xl shadow-lg 
               hover:scale-105 hover:shadow-xl transition-transform duration-300"
                    >
                      New Flashcards
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 
               text-white font-semibold rounded-xl shadow-lg 
               hover:scale-105 hover:shadow-xl transition-transform duration-300 
               disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">📝 Quiz Maker</h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create a quiz for you..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:ring-4 focus:ring-purple-400/50 transition-all duration-300"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 
             text-white font-semibold rounded-xl shadow-lg 
             hover:scale-105 hover:shadow-xl transition-transform duration-300 
             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <LoadingSpinner /> : 'Create Quiz'}

                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
                  <p className="text-xl text-white mb-6">
                    You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    Take Another Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mb-4 text-white">
                    Question {currentQuestion + 1} of {quiz.length}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
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
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'correct'
                                : 'incorrect'
                              : index === quiz[currentQuestion].correct
                              ? 'correct'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {option}
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
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🤖 Ask-Me Study Buddy</h2>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything you want to learn about..."
                    className="flex-1 p-4 rounded-2xl border-0 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:ring-4 focus:ring-purple-400/50 transition-all duration-300"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 
             text-white font-semibold rounded-xl shadow-lg 
             hover:scale-105 hover:shadow-xl transition-transform duration-300 
             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <LoadingSpinner /> : 'Ask'}

                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-blue-500/20 p-4 rounded-lg">
                      <p className="text-white font-medium">You:</p>
                      <p className="text-white/90">{chat.question}</p>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg">
                      <p className="text-white font-medium">Study Buddy:</p>
                      <p className="text-white/90">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                
                {chatHistory.length === 0 && (
                  <div className="text-center text-white/60 py-8">
                    Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions.
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