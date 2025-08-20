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
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-100 mb-4">📖 LearnAI</h1>
          <p className="text-cyan-200/80 text-lg">AI-Powered Educational Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {[
              { id: 'flashcards', label: '🗂️ Flashcards', desc: 'Make Flashcards' },
              { id: 'quiz', label: '🖋️ Quiz', desc: 'Create Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-cyan-100 hover:bg-slate-700/50'
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
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-cyan-100 mb-4">🃏 Flashcard Maker</h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="w-full h-40 p-4 rounded-lg border border-slate-600 bg-slate-700/50 text-cyan-100 placeholder-cyan-300/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-4 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-cyan-100">
                    Card {currentCard + 1} of {flashcards.length}
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

                  <div className="flex justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="px-4 py-2 bg-slate-600/50 text-cyan-100 rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                    >
                      New Flashcards
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 bg-slate-600/50 text-cyan-100 rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors"
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
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-cyan-100 mb-4">📝 Quiz Maker</h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create a quiz for you..."
                    className="w-full h-40 p-4 rounded-lg border border-slate-600 bg-slate-700/50 text-cyan-100 placeholder-cyan-300/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Creating Quiz...' : 'Create Quiz'}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Quiz Complete!</h3>
                  <p className="text-xl text-cyan-100 mb-6">
                    You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
                  >
                    Take Another Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-cyan-100">
                    Question {currentQuestion + 1} of {quiz.length}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-cyan-100 mb-4">
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
                              ? 'bg-slate-700/50 text-cyan-100 hover:bg-slate-600/50 border border-slate-600'
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'correct'
                                : 'incorrect'
                              : index === quiz[currentQuestion].correct
                              ? 'correct'
                              : 'bg-slate-700/30 text-cyan-200/60 border border-slate-600/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <p className="text-cyan-100 font-medium">Explanation:</p>
                          <p className="text-cyan-200/90">{quiz[currentQuestion]?.explanation}</p>
                        </div>
                        <div className="text-center">
                          <button
                            onClick={nextQuestion}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                          >
                            {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Show Results'}
                          </button>
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
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-cyan-100 mb-4">🤖 Ask-Me Study Buddy</h2>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything you want to learn about..."
                    className="flex-1 p-4 rounded-lg border border-slate-600 bg-slate-700/50 text-cyan-100 placeholder-cyan-300/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Thinking...' : 'Ask'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
                      <p className="text-cyan-100 font-medium">You:</p>
                      <p className="text-cyan-200/90">{chat.question}</p>
                    </div>
                    <div className="bg-emerald-600/20 p-4 rounded-lg border border-emerald-600/30">
                      <p className="text-cyan-100 font-medium">Study Buddy:</p>
                      <p className="text-cyan-200/90">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                
                {chatHistory.length === 0 && (
                  <div className="text-center text-cyan-300/60 py-8">
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