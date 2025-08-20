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
  <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-violet-400 text-white font-sans">
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-950 drop-shadow-lg mb-2">
           LearnAI
        </h1>
        <p className="text-lg text-black">Your AI-Powered Study Partner</p>
      </header>


        {/* Tabs */}
        <div className="flex justify-center mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-blue-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700/50 animate-slide-in-up">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Generate from notes' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Test your knowledge' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask any question' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-lg transition-all duration-300 font-medium group ${
                  activeTab === tab.id
                    ? 'bg-blue-800 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-blue-900/80'
                }`}
              >
                <div className="text-base">{tab.label}</div>
                <div className="text-xs opacity-70 group-hover:opacity-90 transition-opacity">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="max-w-4xl mx-auto">
          <div className="bg-blue-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700/50 animate-slide-in-up">
            {/* Flashcards Tab */}
            {activeTab === 'flashcards' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-blue-100 mb-6" >🃏 Flashcard Maker</h2>
                {flashcards.length === 0 ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your study notes here and I'll create flashcards for you..."
                      className="w-full h-48 p-4 rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="mt-4 w-full px-6 py-3  bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-100"
                    >
                      {loading ? 'Generating...' : '✨ Generate Flashcards'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div 
                      className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer w-full max-w-lg`}
                      onClick={() => setFlipped(!flipped)}
                    >
                      <div className="flashcard-inner">
                        <div className="flashcard-front flex items-center justify-center p-6 text-center">
                          <p className="text-2xl font-semibold">{flashcards[currentCard]?.front}</p>
                        </div>
                        <div className="flashcard-back flex items-center justify-center p-6 text-center">
                          <p className="text-xl">{flashcards[currentCard]?.back}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 text-gray-400">
                      Card {currentCard + 1} of {flashcards.length}
                    </div>
                    <div className="flex justify-center items-center space-x-4 w-full">
                      <button onClick={prevCard} disabled={currentCard === 0} className="px-5 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-all">Previous</button>
                      <button onClick={() => setFlashcards([])} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">Start Over</button>
                      <button onClick={nextCard} disabled={currentCard === flashcards.length - 1} className="px-5 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-all">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-6">📝 Quiz Maker</h2>
                {quiz.length === 0 && !showResults ? (
                  <div>
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste text here and I'll create a quiz for you..."
                      className="w-full h-48 p-4 rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="mt-4 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-100"
                    >
                      {loading ? 'Creating Quiz...' : '🚀 Create Quiz'}
                    </button>
                  </div>
                ) : showResults ? (
                  <div className="text-center py-8 animate-fade-in">
                    <h3 className="text-4xl font-bold text-white mb-4">🎉 Quiz Complete! 🎉</h3>
                    <p className="text-2xl text-gray-300 mb-6">
                      You scored <span className="font-bold text-green-400">{score}</span> out of <span className="font-bold text-white">{quiz.length}</span> ({Math.round((score / quiz.length) * 100)}%)
                    </p>
                    <button
                      onClick={() => { setQuiz([]); setShowResults(false); setScore(0); }}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-100"
                    >
                      Take Another Quiz
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="mb-4 text-gray-400 text-right">
                      Question {currentQuestion + 1} / {quiz.length}
                    </div>
                    <div className="mb-6 bg-gray-900/50 p-6 rounded-lg">
                      <h3 className="text-2xl font-semibold text-white mb-5">
                        {quiz[currentQuestion]?.question}
                      </h3>
                      <div className="space-y-3">
                        {quiz[currentQuestion]?.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => selectAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-lg transition-all duration-300 text-lg quiz-option ${
                              selectedAnswer === null
                                ? 'bg-gray-700/70 text-gray-200 hover:bg-gray-600/70'
                                : selectedAnswer === index
                                ? index === quiz[currentQuestion].correct ? 'correct' : 'incorrect'
                                : index === quiz[currentQuestion].correct ? 'correct' : 'bg-gray-700/50 text-gray-400 opacity-70'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    {selectedAnswer !== null && (
                      <div className="mt-4 p-4 bg-gray-900/70 rounded-lg border border-gray-700 animate-fade-in">
                        <p className="text-lg font-bold text-white">Explanation:</p>
                        <p className="text-gray-300 mt-1">{quiz[currentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Study Buddy Tab */}
            {activeTab === 'study-buddy' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-6">🤖 Study Buddy</h2>
                <div className="mb-6">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 p-4 rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && !loading && askStudyBuddy()}
                    />
                    <button
                      onClick={askStudyBuddy}
                      disabled={loading || !question.trim()}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-100"
                    >
                      {loading ? 'Thinking...' : 'Ask'}
                    </button>
                  </div>
                </div>
                <div className="space-y-6 max-h-[50vh] overflow-y-auto p-1 pr-4">
                  {chatHistory.length > 0 ? chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-4 animate-fade-in">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 p-4 rounded-lg rounded-br-none max-w-xl">
                          <p className="text-white">{chat.question}</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-700 p-4 rounded-lg rounded-bl-none max-w-xl">
                          <p className="text-gray-200 whitespace-pre-wrap">{chat.answer}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-450 py-16 animate-fade-in">
                      <p className="text-xl">I can explain concepts, provide examples, and answer your questions.</p>
                      <p>Let's start learning!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}