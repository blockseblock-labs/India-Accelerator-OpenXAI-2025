'use client'
import { useState, useEffect } from 'react'
import { Brain, Sparkles, BookOpen, MessageCircle, ArrowRight, ArrowLeft, RotateCcw, Play, Pause, CheckCircle, XCircle, Star, Zap, Target, Award } from 'lucide-react'

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

export default function EnhancedLearnAI() {
  const [activeTab, setActiveTab] = useState('flashcards')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  // Your original API functions - keep these as they were
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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Brain className="w-8 h-8 text-purple-300 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              LearnAI
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
          </div>
          <p className="text-white/80 text-xl font-light">
            Transform your learning with AI-powered intelligence
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Smart Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Track Progress</span>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl">
            <div className="flex space-x-2">
              {[
                { 
                  id: 'flashcards', 
                  label: 'Flashcards', 
                  desc: 'Smart Cards',
                  icon: BookOpen,
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  id: 'quiz', 
                  label: 'Quiz Master', 
                  desc: 'Test Knowledge',
                  icon: Target,
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  id: 'study-buddy', 
                  label: 'AI Tutor', 
                  desc: 'Ask Anything',
                  icon: MessageCircle,
                  color: 'from-purple-500 to-pink-500'
                }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative px-8 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${
                      activeTab === tab.id 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl shadow-purple-500/25` 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                      <div className="text-left">
                        <div className="text-sm font-semibold">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.desc}</div>
                      </div>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="max-w-6xl mx-auto">
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Smart Flashcard Creator</h2>
              </div>
              
              {flashcards.length === 0 ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your study material here and watch the magic happen! I'll transform it into interactive flashcards..."
                      className="w-full h-48 p-6 rounded-2xl border-0 bg-white/5 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm resize-none text-lg leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {notes.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                  >
                    <div className="flex items-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating Magic...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Flashcards</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between text-white/80">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium">
                        Card {currentCard + 1} of {flashcards.length}
                      </div>
                      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full"
                          style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div 
                    className="flashcard-3d group cursor-pointer"
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className={`flashcard-container ${flipped ? 'flipped' : ''}`}>
                      <div className="flashcard-front-3d">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-600/90 rounded-3xl backdrop-blur-sm" />
                        <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                          <div className="mb-4 p-3 bg-white/20 rounded-full">
                            <BookOpen className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xl font-medium text-white leading-relaxed">
                            {flashcards[currentCard]?.front}
                          </p>
                          <div className="mt-6 text-white/60 text-sm">Click to reveal answer</div>
                        </div>
                      </div>
                      
                      <div className="flashcard-back-3d">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-emerald-600/90 rounded-3xl backdrop-blur-sm" />
                        <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                          <div className="mb-4 p-3 bg-white/20 rounded-full">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xl text-white leading-relaxed">
                            {flashcards[currentCard]?.back}
                          </p>
                          <div className="mt-6 text-white/60 text-sm">Click to see question</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </button>

                    <button
                      onClick={() => setFlashcards([])}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <RotateCcw className="w-5 h-5" />
                      New Set
                    </button>

                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Quiz Master</h2>
              </div>

              {quiz.length === 0 && !showResults ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste your study material here and I'll create an engaging quiz to test your knowledge..."
                      className="w-full h-48 p-6 rounded-2xl border-0 bg-white/5 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 backdrop-blur-sm resize-none text-lg leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                      {quizText.length} characters
                    </div>
                  </div>
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
                  >
                    <div className="flex items-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Crafting Quiz...</span>
                        </>
                      ) : (
                        <>
                          <Target className="w-5 h-5" />
                          <span>Create Quiz</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ) : showResults ? (
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/20">
                      <Award className="w-12 h-12 text-yellow-400" />
                      <div>
                        <h3 className="text-3xl font-bold text-white">Quiz Complete!</h3>
                        <p className="text-white/80">Well done on finishing the quiz!</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
                      <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                        {Math.round((score / quiz.length) * 100)}%
                      </div>
                      <p className="text-xl text-white mb-4">
                        You scored {score} out of {quiz.length} questions correctly
                      </p>
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-8 h-8 ${
                              i < Math.floor((score / quiz.length) * 5) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                  >
                    Take Another Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between text-white/80">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium">
                        Question {currentQuestion + 1} of {quiz.length}
                      </div>
                      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full"
                          style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="grid gap-4">
                      {quiz[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`group p-6 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                            selectedAnswer === null 
                              ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20' 
                              : selectedAnswer === index
                                ? index === quiz[currentQuestion].correct
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-lg shadow-green-500/25'
                                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400 shadow-lg shadow-red-500/25'
                                : index === quiz[currentQuestion].correct
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-lg shadow-green-500/25'
                                  : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                              selectedAnswer === null ? 'border-white/30' : 'border-current'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-lg">{option}</span>
                            {selectedAnswer !== null && (
                              <div className="ml-auto">
                                {index === quiz[currentQuestion].correct ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : selectedAnswer === index ? (
                                  <XCircle className="w-6 h-6" />
                                ) : null}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedAnswer !== null && (
                      <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Brain className="w-5 h-5 text-blue-400" />
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
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">AI Study Tutor</h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything you want to learn about..."
                    className="flex-1 p-4 rounded-2xl border-0 bg-white/5 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  >
                    <div className="flex items-center gap-2">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      )}
                      <span>{loading ? 'Thinking...' : 'Ask'}</span>
                    </div>
                  </button>
                </div>

                <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl rounded-tr-sm">
                          <p className="text-white font-medium mb-1">You asked:</p>
                          <p className="text-white/90 leading-relaxed">{chat.question}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-2xl rounded-tl-sm backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 bg-purple-500/30 rounded-full">
                              <Brain className="w-4 h-4 text-purple-300" />
                            </div>
                            <p className="text-white font-medium">AI Tutor:</p>
                          </div>
                          <p className="text-white/90 leading-relaxed">{chat.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <MessageCircle className="w-8 h-8 text-purple-400" />
                        <div>
                          <p className="text-white font-medium mb-1">Ready to help you learn!</p>
                          <p className="text-white/60 text-sm">Ask me anything and I'll provide detailed explanations</p>
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