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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="retro-title text-5xl mb-4 glitch">
            LEARNMATE.AI
          </h1>
          <p className="retro-subtitle text-xl text-red-400 mb-2">
            NEURAL NETWORK LEARNING SYSTEM
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="retro-card p-2 flex space-x-2">
            {[
              { id: 'flashcards', label: 'FLASHCARDS', desc: 'MEMORY CARDS' },
              { id: 'quiz', label: 'QUIZ', desc: 'KNOWLEDGE TEST' },
              { id: 'study-buddy', label: 'AI CHAT', desc: 'NEURAL ASSISTANT' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`retro-tab px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id ? 'active' : ''
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
            <div className="retro-card p-8">
              <h2 className="retro-subtitle text-2xl text-red-400 mb-6 text-center">
                FLASHCARD GENERATOR
              </h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ENTER YOUR STUDY MATERIAL HERE..."
                    className="retro-input w-full h-40 p-4 rounded-lg resize-none"
                  />
                  <div className="text-center mt-6">
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="retro-btn px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center space-x-2">
                          <div className="retro-loading"></div>
                          <span>PROCESSING...</span>
                        </span>
                      ) : (
                        'GENERATE FLASHCARDS'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <div className="retro-text text-lg text-gray-300">
                      CARD {currentCard + 1} / {flashcards.length}
                    </div>
                  </div>
                  
                  <div 
                    className="flashcard cursor-pointer"
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <p className="retro-text">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className="flashcard-back">
                        <p className="retro-text">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="retro-btn-secondary px-6 py-3 disabled:opacity-50"
                    >
                      PREVIOUS
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="retro-btn px-6 py-3"
                    >
                      NEW SET
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="retro-btn-secondary px-6 py-3 disabled:opacity-50"
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="retro-card p-8">
              <h2 className="retro-subtitle text-2xl text-red-400 mb-6 text-center">
                QUIZ GENERATOR
              </h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="ENTER TEXT TO CREATE QUIZ FROM..."
                    className="retro-input w-full h-40 p-4 rounded-lg resize-none"
                  />
                  <div className="text-center mt-6">
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="retro-btn px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center space-x-2">
                          <div className="retro-loading"></div>
                          <span>ANALYZING...</span>
                        </span>
                      ) : (
                        'CREATE QUIZ'
                      )}
                    </button>
                  </div>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="retro-title text-3xl text-red-400 mb-6">MISSION COMPLETE</h3>
                  <div className="retro-card p-8 mb-6">
                    <p className="retro-text text-2xl mb-4">
                      SCORE: {score} / {quiz.length}
                    </p>
                    <p className="retro-text text-xl text-gray-300">
                      ACCURACY: {Math.round((score / quiz.length) * 100)}%
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="retro-btn px-8 py-4 text-lg"
                  >
                    NEW QUIZ
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <div className="retro-text text-lg text-gray-300">
                      QUESTION {currentQuestion + 1} / {quiz.length}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="retro-subtitle text-xl text-red-400 mb-6 text-center">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-4">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`quiz-option w-full p-4 text-left rounded-lg transition-all ${
                            selectedAnswer === null
                              ? ''
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'correct'
                                : 'incorrect'
                              : index === quiz[currentQuestion].correct
                              ? 'correct'
                              : 'opacity-50'
                          }`}
                        >
                          <span className="retro-text">{option}</span>
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-6 retro-card p-6">
                        <p className="retro-subtitle text-red-400 mb-2">ANALYSIS:</p>
                        <p className="retro-text">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Buddy Tab */}
          {activeTab === 'study-buddy' && (
            <div className="retro-card p-8">
              <h2 className="retro-subtitle text-2xl text-red-400 mb-6 text-center">
                AI STUDY ASSISTANT
              </h2>
              
              <div className="mb-6">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="ASK ANYTHING..."
                    className="retro-input flex-1 p-4 rounded-lg"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="retro-btn px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="retro-loading"></div>
                    ) : (
                      'ASK'
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-3">
                    <div className="chat-message user">
                      <p className="retro-subtitle text-red-400 mb-1">YOU:</p>
                      <p className="retro-text">{chat.question}</p>
                    </div>
                    <div className="chat-message buddy">
                      <p className="retro-subtitle text-gray-400 mb-1">AI ASSISTANT:</p>
                      <p className="retro-text">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                
                {chatHistory.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <div className="retro-subtitle text-xl mb-4">NEURAL NETWORK READY</div>
                    <p className="retro-text">
                      Ask me anything and I'll help you learn! I can explain concepts, 
                      provide examples, and answer your questions with advanced AI analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full mb-4"></div>
          <p className="retro-text text-gray-400 text-sm">
            POWERED BY ADVANCED NEURAL NETWORKS
          </p>
        </div>
      </div>
          </div>
    )
} 