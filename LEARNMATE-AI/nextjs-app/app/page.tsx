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

interface Summary {
  title: string
  keyPoints: string[]
  mainConcepts: string[]
  summary: string
}

interface PracticeTest {
  questions: QuizQuestion[]
  timeLimit: number
  difficulty: string
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

  // Notes Summarizer states
  const [summaryText, setSummaryText] = useState('')
  const [summary, setSummary] = useState<Summary | null>(null)

  // Practice Tests states
  const [testContent, setTestContent] = useState('')
  const [practiceTest, setPracticeTest] = useState<PracticeTest | null>(null)
  const [testInProgress, setTestInProgress] = useState(false)
  const [testCurrentQuestion, setTestCurrentQuestion] = useState(0)
  const [testSelectedAnswer, setTestSelectedAnswer] = useState<number | null>(null)
  const [testShowResults, setTestShowResults] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

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

  const generateSummary = async () => {
    if (!summaryText.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summaryText }) // Changed from summaryText to text
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Error from API: ${JSON.stringify(data)}`)
      }
      
      if (data.summary) {
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    }
    setLoading(false)
  }

  const generatePracticeTest = async () => {
    if (!testContent.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/practice-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testContent }) // Changed from testContent to text
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Error from API: ${JSON.stringify(data)}`)
      }
      
      if (data.test) {
        setPracticeTest(data.test)
      }
    } catch (error) {
      console.error('Error generating practice test:', error)
    }
    setLoading(false)
  }

  const startPracticeTest = () => {
    if (!practiceTest) return
    
    setTestInProgress(true)
    setTestCurrentQuestion(0)
    setTestSelectedAnswer(null)
    setTestShowResults(false)
    setTestScore(0)
    setTimeRemaining(practiceTest.timeLimit * 60) // Convert minutes to seconds
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setTestShowResults(true)
          setTestInProgress(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    setTimerInterval(interval)
  }

  const selectTestAnswer = (answerIndex: number) => {
    if (!practiceTest) return
    
    setTestSelectedAnswer(answerIndex)
    
    if (answerIndex === practiceTest.questions[testCurrentQuestion].correct) {
      setTestScore(testScore + 1)
    }
    
    setTimeout(() => {
      if (testCurrentQuestion < practiceTest.questions.length - 1) {
        setTestCurrentQuestion(testCurrentQuestion + 1)
        setTestSelectedAnswer(null)
      } else {
        if (timerInterval) clearInterval(timerInterval)
        setTestShowResults(true)
        setTestInProgress(false)
      }
    }, 1500)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📚 LearnAI</h1>
          <p className="text-white/80 text-lg">AI-Powered Educational Tools</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex flex-wrap justify-center gap-2">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' },
              { id: 'summarizer', label: '📄 Summarizer', desc: 'Summarize Notes' },
              { id: 'practice-test', label: '🎯 Practice Test', desc: 'Full Exams' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg'
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🃏 Flashcard Maker</h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Paste your study notes here and I'll create flashcards for you..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-white">
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
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      New Flashcards
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50"
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
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Quiz...' : 'Create Quiz'}
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
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                  >
                    Take Another Quiz
                  </button>
                </div>
              ) : (
                <div>
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
                    className="flex-1 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Thinking...' : 'Ask'}
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

          {/* Notes Summarizer Tab */}
          {activeTab === 'summarizer' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">📄 Notes Summarizer</h2>
              
              {!summary ? (
                <div>
                  <textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Paste your lengthy notes, PDFs content, or study materials here and I'll create a concise summary with key points..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    onClick={generateSummary}
                    disabled={loading || !summaryText.trim()}
                    className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Summarizing...' : 'Generate Summary'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/20 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">📋 {summary.title}</h3>
                    <p className="text-white/90 leading-relaxed">{summary.summary}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/20 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-white mb-3">🔑 Key Points</h4>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="text-white/90 flex items-start">
                            <span className="text-yellow-300 mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-white mb-3">💡 Main Concepts</h4>
                      <div className="flex flex-wrap gap-2">
                        {summary.mainConcepts.map((concept, index) => (
                          <span key={index} className="bg-blue-500/30 text-white px-3 py-1 rounded-full text-sm">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setSummary(null)}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg"
                    >
                      New Summary
                    </button>
                    <button
                      onClick={() => {
                        setNotes(summaryText)
                        setActiveTab('flashcards')
                      }}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                    >
                      Create Flashcards
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Practice Test Tab */}
          {activeTab === 'practice-test' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Practice Test Generator</h2>
              
              {!practiceTest && !testInProgress && !testShowResults ? (
                <div>
                  <textarea
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    placeholder="Paste your study materials here and I'll create a comprehensive practice test with multiple question types..."
                    className="w-full h-40 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    onClick={generatePracticeTest}
                    disabled={loading || !testContent.trim()}
                    className="mt-4 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Test...' : 'Generate Practice Test'}
                  </button>
                </div>
              ) : practiceTest && !testInProgress && !testShowResults ? (
                <div className="text-center space-y-6">
                  <div className="bg-white/20 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Practice Test Ready!</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-white">
                      <div className="bg-blue-500/30 rounded-lg p-4">
                        <div className="text-2xl font-bold">{practiceTest.questions.length}</div>
                        <div className="text-sm opacity-75">Questions</div>
                      </div>
                      <div className="bg-green-500/30 rounded-lg p-4">
                        <div className="text-2xl font-bold">{practiceTest.timeLimit}</div>
                        <div className="text-sm opacity-75">Minutes</div>
                      </div>
                      <div className="bg-purple-500/30 rounded-lg p-4">
                        <div className="text-2xl font-bold">{practiceTest.difficulty}</div>
                        <div className="text-sm opacity-75">Difficulty</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setPracticeTest(null)}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg"
                    >
                      Create New Test
                    </button>
                    <button
                      onClick={startPracticeTest}
                      className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
                    >
                      Start Test
                    </button>
                  </div>
                </div>
              ) : testInProgress ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-white">
                      Question {testCurrentQuestion + 1} of {practiceTest?.questions.length}
                    </div>
                    <div className="bg-red-500/30 text-white px-4 py-2 rounded-lg font-bold">
                      ⏰ {formatTime(timeRemaining)}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {practiceTest?.questions[testCurrentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {practiceTest?.questions[testCurrentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectTestAnswer(index)}
                          disabled={testSelectedAnswer !== null}
                          className={`w-full p-4 text-left rounded-lg transition-all ${
                            testSelectedAnswer === null
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : testSelectedAnswer === index
                              ? index === practiceTest?.questions[testCurrentQuestion].correct
                                ? 'bg-green-500/50 text-white'
                                : 'bg-red-500/50 text-white'
                              : index === practiceTest?.questions[testCurrentQuestion].correct
                              ? 'bg-green-500/50 text-white'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {testSelectedAnswer !== null && (
                      <div className="mt-4 p-4 bg-white/20 rounded-lg">
                        <p className="text-white font-medium">Explanation:</p>
                        <p className="text-white/90">{practiceTest?.questions[testCurrentQuestion]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : testShowResults ? (
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold text-white mb-4">Test Complete!</h3>
                  <div className="bg-white/20 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6 text-white">
                      <div>
                        <div className="text-4xl font-bold text-green-400">{testScore}/{practiceTest?.questions.length}</div>
                        <div className="text-lg">Final Score</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-blue-400">
                          {Math.round((testScore / (practiceTest?.questions.length || 1)) * 100)}%
                        </div>
                        <div className="text-lg">Percentage</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setPracticeTest(null)
                        setTestShowResults(false)
                        setTestScore(0)
                      }}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                    >
                      Create New Test
                    </button>
                    <button
                      onClick={() => {
                        setTestInProgress(false)
                        setTestShowResults(false)
                        setTestCurrentQuestion(0)
                        setTestSelectedAnswer(null)
                        setTestScore(0)
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg"
                    >
                      Retake Test
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}