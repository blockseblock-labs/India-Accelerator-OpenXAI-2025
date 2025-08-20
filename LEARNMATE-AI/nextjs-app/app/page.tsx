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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-neon-blue drop-shadow-neon mb-4 tracking-tighter">LEARNMATE <span className="text-neon-purple">AI</span></h1>
          <p className="text-light-grey text-xl font-mono">Your <span className="text-neon-blue">AI-Powered</span> Educational Assistant</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="card p-1 flex space-x-1">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Generate & Practice' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Test Your Knowledge' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask & Learn' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`button px-6 py-3 transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-neon-blue text-dark-grey shadow-neon-blue-lg opacity-100' // Active tab uses button gradient and is fully opaque
                    : 'bg-transparent text-light-grey hover:bg-mid-grey hover:text-neon-blue hover:shadow-neon-blue-sm opacity-80' // Inactive tabs are transparent and less opaque, hover effect
                } flex flex-col items-center border-none focus:outline-none`}
              >
                <div className="text-xl font-bold">{tab.label}</div>
                <div className="text-xs opacity-80 mt-1">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto extraordinary-element">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="card p-6">
              <h2 className="text-3xl font-bold text-neon-blue mb-6 border-b-2 border-neon-blue/50 pb-2">🃏 Flashcard Maker</h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="input w-full h-40"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="button mt-4 w-full"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-pulse">GENERATING</span>
                        <span className="ml-2 text-neon-green">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    ) : (
                      'GENERATE FLASHCARDS'
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-light-grey text-center">
                    <span className="text-neon-blue">Card {currentCard + 1}</span> of {flashcards.length}
                  </div>
                  
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <p className="text-xl font-medium">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className="flashcard-back">
                        <p className="text-xl">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="button px-4 py-2 opacity-80 disabled:opacity-40"
                    >
                      <span className="text-light-grey">&#9664; PREVIOUS</span>
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="button px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      NEW SET
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="button px-4 py-2 opacity-80 disabled:opacity-40"
                    >
                      <span className="text-light-grey">NEXT &#9654;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="card p-6">
              <h2 className="text-3xl font-bold text-neon-blue mb-6 border-b-2 border-neon-blue/50 pb-2">📝 Quiz Maker</h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste text here and I'll create a quiz for you..."
                    className="input w-full h-40"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="button mt-4 w-full"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-pulse">CREATING QUIZ</span>
                        <span className="ml-2 text-neon-green">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    ) : (
                      'CREATE QUIZ'
                    )}
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-neon-blue mb-4">Quiz Complete!</h3>
                  <p className="text-2xl text-light-grey mb-6">
                    You scored <span className="text-neon-blue">{score}</span> out of <span className="text-neon-blue">{quiz.length}</span> (<span className="text-neon-purple">{Math.round((score / quiz.length) * 100)}%</span>)
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="button mt-4 px-6 py-3"
                  >
                    TAKE ANOTHER QUIZ
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-light-grey text-center">
                    <span className="text-neon-blue">Question {currentQuestion + 1}</span> of {quiz.length}
                  </div>
                  
                  <div className="mb-6 card p-5">
                    <h3 className="text-xl font-bold text-light-grey mb-4">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`button w-full p-4 text-left quiz-option ${selectedAnswer === null
                              ? ''
                              : selectedAnswer === index
                              ? index === quiz[currentQuestion].correct
                                ? 'correct'
                                : 'incorrect'
                              : index === quiz[currentQuestion].correct
                              ? 'correct'
                              : 'opacity-60' // Dim unselected incorrect options
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
            <div className="card p-6">
              <h2 className="text-3xl font-bold text-neon-blue mb-6 border-b-2 border-neon-blue/50 pb-2">🤖 Ask-Me Study Buddy</h2>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything you want to learn about..."
                    className="input flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="button px-6 py-3"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-pulse">THINKING</span>
                        <span className="ml-2 text-neon-green">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    ) : (
                      'ASK'
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="card p-4">
                      <p className="text-neon-blue font-medium">You:</p>
                      <p className="text-light-grey">{chat.question}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-neon-purple font-medium">Study Buddy:</p>
                      <p className="text-light-grey">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                
                {chatHistory.length === 0 && (
                  <div className="text-center text-light-grey/60 py-8">
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