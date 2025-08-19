'use client';

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

const [darkMode, setDarkMode] = useState(false);

const toggleDarkMode = () => {
  setDarkMode(!darkMode);

  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark");
  }
};


  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'}`}>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>📚 LearnAI</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-white/80'} text-lg`}>AI-Powered Educational Tools</p>
        <button
        onClick={toggleDarkMode}
        className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          darkMode
          ? 'bg-white text-gray-900 hover:bg-gray-200'
          : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
        >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/20'} backdrop-blur-sm rounded-lg p-2 flex space-x-2`}>
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
            ? darkMode
              ? 'bg-white text-purple-600 shadow-lg'
              : 'bg-white text-purple-600 shadow-lg'
            : darkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-white hover:bg-white/10'
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
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-6`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>🃏 Flashcard Maker</h2>
          
          {flashcards.length === 0 ? (
          <div>
            <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your study notes here and I'll create flashcards for you..."
            className={`w-full h-40 p-4 rounded-lg border-0 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-gray-500' : 'bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30'}`}
            />
            <button
            onClick={generateFlashcards}
            disabled={loading || !notes.trim()}
            className={`mt-4 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
              ? 'bg-blue-700 hover:bg-blue-800 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            >
            {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
          </div>
          ) : (
          <div>
            <div className={`${darkMode ? 'text-gray-300' : 'text-white'} mb-4`}>
            Card {currentCard + 1} of {flashcards.length}
            </div>
            
            <div 
            className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer`}
            onClick={() => setFlipped(!flipped)}
            >
            <div className="flashcard-inner">
              <div className="flashcard-front">
              <p className={`text-lg font-medium ${darkMode ? 'text-white' : ''}`}>{flashcards[currentCard]?.front}</p>
              </div>
              <div className="flashcard-back">
              <p className={`text-lg ${darkMode ? 'text-white' : ''}`}>{flashcards[currentCard]?.back}</p>
              </div>
            </div>
            </div>

            <div className="flex justify-between">
            <button
              onClick={prevCard}
              disabled={currentCard === 0}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white/20 text-white'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setFlashcards([])}
              className={`px-4 py-2 rounded-lg ${
              darkMode ? 'bg-red-700 text-white' : 'bg-red-500 text-white'
              }`}
            >
              New Flashcards
            </button>
            <button
              onClick={nextCard}
              disabled={currentCard === flashcards.length - 1}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white/20 text-white'
              }`}
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
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-6`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>📝 Quiz Maker</h2>
          
          {quiz.length === 0 && !showResults ? (
          <div>
            <textarea
            value={quizText}
            onChange={(e) => setQuizText(e.target.value)}
            placeholder="Paste text here and I'll create a quiz for you..."
            className={`w-full h-40 p-4 rounded-lg border-0 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-gray-500' : 'bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30'}`}
            />
            <button
            onClick={generateQuiz}
            disabled={loading || !quizText.trim()}
            className={`mt-4 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
              ? 'bg-green-700 hover:bg-green-800 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            >
            {loading ? 'Creating Quiz...' : 'Create Quiz'}
            </button>
          </div>
          ) : showResults ? (
          <div className="text-center">
            <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>Quiz Complete!</h3>
            <p className={`text-xl mb-6 ${darkMode ? 'text-white' : 'text-white'}`}>
            You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
            </p>
            <button
            onClick={() => {
              setQuiz([])
              setShowResults(false)
              setScore(0)
            }}
            className={`px-6 py-3 rounded-lg ${
              darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
            }`}
            >
            Take Another Quiz
            </button>
          </div>
          ) : (
          <div>
            <div className={`${darkMode ? 'text-gray-300' : 'text-white'} mb-4`}>
            Question {currentQuestion + 1} of {quiz.length}
            </div>
            
            <div className="mb-6">
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
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
                  ? darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  : selectedAnswer === index
                  ? index === quiz[currentQuestion].correct
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
                  : index === quiz[currentQuestion].correct
                  ? 'bg-green-600 text-white'
                  : darkMode
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-white/10 text-white/60'
                }`}
              >
                {option}
              </button>
              ))}
            </div>
            
            {selectedAnswer !== null && (
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white/20'} mt-4 p-4 rounded-lg`}>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-white'}`}>Explanation:</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-white/90'}`}>{quiz[currentQuestion]?.explanation}</p>
              </div>
            )}
            </div>
          </div>
          )}
        </div>
        )}

        {/* Study Buddy Tab */}
        {activeTab === 'study-buddy' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-6`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>🤖 Ask-Me Study Buddy</h2>
          
          <div className="mb-6">
          <div className="flex space-x-2">
            <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything you want to learn about..."
            className={`flex-1 p-4 rounded-lg border-0 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-gray-500' : 'bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30'}`}
            onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
            />
            <button
            onClick={askStudyBuddy}
            disabled={loading || !question.trim()}
            className={`px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
              ? 'bg-purple-700 hover:bg-purple-800 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
            >
            {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2">
            <div className={`${darkMode ? 'bg-blue-900/40' : 'bg-blue-500/20'} p-4 rounded-lg`}>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-white'}`}>You:</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-white/90'}`}>{chat.question}</p>
            </div>
            <div className={`${darkMode ? 'bg-green-900/40' : 'bg-green-500/20'} p-4 rounded-lg`}>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-white'}`}>Study Buddy:</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-white/90'}`}>{chat.answer}</p>
            </div>
            </div>
          ))}
          
          {chatHistory.length === 0 && (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-white/60'}`}>
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