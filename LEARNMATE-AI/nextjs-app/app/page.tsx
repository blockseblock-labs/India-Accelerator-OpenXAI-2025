// 'use client'

// import { useState } from 'react'

// interface Flashcard {
//   front: string
//   back: string
// }

// interface QuizQuestion {
//   question: string
//   options: string[]
//   correct: number
//   explanation: string
// }

// export default function LearnAI() {
//   const [activeTab, setActiveTab] = useState('flashcards')
//   const [loading, setLoading] = useState(false)
  
//   // Flashcard states
//   const [notes, setNotes] = useState('')
//   const [flashcards, setFlashcards] = useState<Flashcard[]>([])
//   const [currentCard, setCurrentCard] = useState(0)
//   const [flipped, setFlipped] = useState(false)
  
//   // Quiz states
//   const [quizText, setQuizText] = useState('')
//   const [quiz, setQuiz] = useState<QuizQuestion[]>([])
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
//   const [showResults, setShowResults] = useState(false)
//   const [score, setScore] = useState(0)
  
//   // Study Buddy states
//   const [question, setQuestion] = useState('')
//   const [answer, setAnswer] = useState('')
//   const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])

//   const generateFlashcards = async () => {
//     if (!notes.trim()) return
    
//     setLoading(true)
//     try {
//       const response = await fetch('/api/flashcards', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ notes })
//       })
      
//       const data = await response.json()
//       if (data.flashcards) {
//         setFlashcards(data.flashcards)
//         setCurrentCard(0)
//         setFlipped(false)
//       }
//     } catch (error) {
//       console.error('Error generating flashcards:', error)
//     }
//     setLoading(false)
//   }

//   const generateQuiz = async () => {
//     if (!quizText.trim()) return
    
//     setLoading(true)
//     try {
//       const response = await fetch('/api/quiz', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: quizText })
//       })
      
//       const data = await response.json()
//       if (data.quiz) {
//         setQuiz(data.quiz)
//         setCurrentQuestion(0)
//         setSelectedAnswer(null)
//         setShowResults(false)
//         setScore(0)
//       }
//     } catch (error) {
//       console.error('Error generating quiz:', error)
//     }
//     setLoading(false)
//   }

//   const askStudyBuddy = async () => {
//     if (!question.trim()) return
    
//     setLoading(true)
//     try {
//       const response = await fetch('/api/study-buddy', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question })
//       })
      
//       const data = await response.json()
//       if (data.answer) {
//         const newChat = { question, answer: data.answer }
//         setChatHistory(prev => [...prev, newChat])
//         setAnswer(data.answer)
//         setQuestion('')
//       }
//     } catch (error) {
//       console.error('Error asking study buddy:', error)
//     }
//     setLoading(false)
//   }

//   const nextCard = () => {
//     if (currentCard < flashcards.length - 1) {
//       setCurrentCard(currentCard + 1)
//       setFlipped(false)
//     }
//   }

//   const prevCard = () => {
//     if (currentCard > 0) {
//       setCurrentCard(currentCard - 1)
//       setFlipped(false)
//     }
//   }

//   const selectAnswer = (answerIndex: number) => {
//     setSelectedAnswer(answerIndex)
    
//     if (answerIndex === quiz[currentQuestion].correct) {
//       setScore(score + 1)
//     }
    
//     setTimeout(() => {
//       if (currentQuestion < quiz.length - 1) {
//         setCurrentQuestion(currentQuestion + 1)
//         setSelectedAnswer(null)
//       } else {
//         setShowResults(true)
//       }
//     }, 1500)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-4">📚 LearnAI</h1>
//           <p className="text-white/80 text-lg">AI-Powered Educational Tools</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex justify-center mb-8">
//           <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
//             {[
//               { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
//               { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
//               { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
//             ].map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-6 py-3 rounded-lg transition-all ${
//                   activeTab === tab.id
//                     ? 'bg-white text-purple-600 shadow-lg'
//                     : 'text-white hover:bg-white/10'
//                 }`}
//               >
//                 <div className="text-sm font-medium">{tab.label}</div>
//                 <div className="text-xs opacity-75">{tab.desc}</div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="max-w-4xl mx-auto">
//           {/* Flashcards Tab */}
//           {activeTab === 'flashcards' && (
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//               <h2 className="text-2xl font-bold text-white mb-4">🃏 Flashcard Maker</h2>
              
//               {flashcards.length === 0 ? (
//                 <div>
//                   <textarea
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     placeholder="Paste your study notes here and I'll create flashcards for you..."
//                     className="w-full h-40 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
//                   />
//                   <button
//                     onClick={generateFlashcards}
//                     disabled={loading || !notes.trim()}
//                     className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Generating...' : 'Generate Flashcards'}
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <div className="mb-4 text-white">
//                     Card {currentCard + 1} of {flashcards.length}
//                   </div>
                  
//                   <div 
//                     className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer`}
//                     onClick={() => setFlipped(!flipped)}
//                   >
//                     <div className="flashcard-inner">
//                       <div className="flashcard-front">
//                         <p className="text-lg font-medium">{flashcards[currentCard]?.front}</p>
//                       </div>
//                       <div className="flashcard-back">
//                         <p className="text-lg">{flashcards[currentCard]?.back}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-between">
//                     <button
//                       onClick={prevCard}
//                       disabled={currentCard === 0}
//                       className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50"
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => setFlashcards([])}
//                       className="px-4 py-2 bg-red-500 text-white rounded-lg"
//                     >
//                       New Flashcards
//                     </button>
//                     <button
//                       onClick={nextCard}
//                       disabled={currentCard === flashcards.length - 1}
//                       className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Quiz Tab */}
//           {activeTab === 'quiz' && (
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//               <h2 className="text-2xl font-bold text-white mb-4">📝 Quiz Maker</h2>
              
//               {quiz.length === 0 && !showResults ? (
//                 <div>
//                   <textarea
//                     value={quizText}
//                     onChange={(e) => setQuizText(e.target.value)}
//                     placeholder="Paste text here and I'll create a quiz for you..."
//                     className="w-full h-40 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
//                   />
//                   <button
//                     onClick={generateQuiz}
//                     disabled={loading || !quizText.trim()}
//                     className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Creating Quiz...' : 'Create Quiz'}
//                   </button>
//                 </div>
//               ) : showResults ? (
//                 <div className="text-center">
//                   <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
//                   <p className="text-xl text-white mb-6">
//                     You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
//                   </p>
//                   <button
//                     onClick={() => {
//                       setQuiz([])
//                       setShowResults(false)
//                       setScore(0)
//                     }}
//                     className="px-6 py-3 bg-blue-500 text-white rounded-lg"
//                   >
//                     Take Another Quiz
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <div className="mb-4 text-white">
//                     Question {currentQuestion + 1} of {quiz.length}
//                   </div>
                  
//                   <div className="mb-6">
//                     <h3 className="text-xl font-bold text-white mb-4">
//                       {quiz[currentQuestion]?.question}
//                     </h3>
                    
//                     <div className="space-y-3">
//                       {quiz[currentQuestion]?.options.map((option, index) => (
//                         <button
//                           key={index}
//                           onClick={() => selectAnswer(index)}
//                           disabled={selectedAnswer !== null}
//                           className={`w-full p-4 text-left rounded-lg transition-all quiz-option ${
//                             selectedAnswer === null
//                               ? 'bg-white/20 text-white hover:bg-white/30'
//                               : selectedAnswer === index
//                               ? index === quiz[currentQuestion].correct
//                                 ? 'correct'
//                                 : 'incorrect'
//                               : index === quiz[currentQuestion].correct
//                               ? 'correct'
//                               : 'bg-white/10 text-white/60'
//                           }`}
//                         >
//                           {option}
//                         </button>
//                       ))}
//                     </div>
                    
//                     {selectedAnswer !== null && (
//                       <div className="mt-4 p-4 bg-white/20 rounded-lg">
//                         <p className="text-white font-medium">Explanation:</p>
//                         <p className="text-white/90">{quiz[currentQuestion]?.explanation}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Study Buddy Tab */}
//           {activeTab === 'study-buddy' && (
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//               <h2 className="text-2xl font-bold text-white mb-4">🤖 Ask-Me Study Buddy</h2>
              
//               <div className="mb-6">
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     placeholder="Ask me anything you want to learn about..."
//                     className="flex-1 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
//                     onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
//                   />
//                   <button
//                     onClick={askStudyBuddy}
//                     disabled={loading || !question.trim()}
//                     className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Thinking...' : 'Ask'}
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-4 max-h-96 overflow-y-auto">
//                 {chatHistory.map((chat, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="bg-blue-500/20 p-4 rounded-lg">
//                       <p className="text-white font-medium">You:</p>
//                       <p className="text-white/90">{chat.question}</p>
//                     </div>
//                     <div className="bg-green-500/20 p-4 rounded-lg">
//                       <p className="text-white font-medium">Study Buddy:</p>
//                       <p className="text-white/90">{chat.answer}</p>
//                     </div>
//                   </div>
//                 ))}
                
//                 {chatHistory.length === 0 && (
//                   <div className="text-center text-white/60 py-8">
//                     Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions.
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// } 
'use client'

import { useState, useEffect } from 'react'

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
  
  // Easter egg states
  const [partyMode, setPartyMode] = useState(false)
  const [keySequence, setKeySequence] = useState('')
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  
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

  // Easter egg key sequence detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = keySequence + e.key.toLowerCase()
      setKeySequence(newSequence)
      
      // Check for "party" sequence
      if (newSequence.includes('party')) {
        setPartyMode(!partyMode)
        setShowEasterEgg(true)
        setKeySequence('')
        
        // Hide easter egg message after 3 seconds
        setTimeout(() => setShowEasterEgg(false), 3000)
      }
      
      // Reset sequence if it gets too long
      if (newSequence.length > 10) {
        setKeySequence('')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keySequence, partyMode])

  const generateFlashcards = async () => {
    if (!notes.trim()) return
    
    setLoading(true)
    // Simulate API call with fun responses in party mode
    setTimeout(() => {
      const funFlashcards = partyMode ? [
        { front: "What makes learning fun? 🎉", back: "Secret party modes in study apps! 🕺💃" },
        { front: "Best way to surprise your team?", back: "Hidden Easter eggs that make them smile! 😄" },
        { front: "Why did the developer add party mode?", back: "Because learning should be LIT! 🔥✨" }
      ] : [
        { front: "What is React?", back: "A JavaScript library for building user interfaces" },
        { front: "What is a component?", back: "A reusable piece of code that returns JSX" },
        { front: "What is useState?", back: "A React hook for managing component state" }
      ]
      
      setFlashcards(funFlashcards)
      setCurrentCard(0)
      setFlipped(false)
      setLoading(false)
    }, 1000)
  }

  const generateQuiz = async () => {
    if (!quizText.trim()) return
    
    setLoading(true)
    setTimeout(() => {
      const funQuiz = partyMode ? [
        {
          question: "What's the best Easter egg discovery reaction? 🎊",
          options: ["😮 Mind blown", "🤣 Uncontrollable laughter", "🕺 Instant dance party", "All of the above"],
          correct: 3,
          explanation: "The correct answer is all of the above! A good Easter egg should surprise, delight, and energize!"
        },
        {
          question: "In party mode, what color should confetti be? 🎨",
          options: ["Rainbow explosion 🌈", "Gold sparkles ✨", "Neon vibes 💫", "All colors at once! 🎆"],
          correct: 3,
          explanation: "When you're partying, why limit yourself? All the colors make it magical!"
        }
      ] : [
        {
          question: "What is JSX?",
          options: ["JavaScript XML", "Java Syntax Extension", "JSON eXtended", "JavaScript eXtended"],
          correct: 0,
          explanation: "JSX stands for JavaScript XML and allows you to write HTML-like syntax in React"
        }
      ]
      
      setQuiz(funQuiz)
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setShowResults(false)
      setScore(0)
      setLoading(false)
    }, 1000)
  }

  const askStudyBuddy = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    setTimeout(() => {
      const partyResponse = partyMode 
        ? "🎉 PARTY MODE ACTIVATED! 🎉 Did you know that the best way to learn is when you're having fun? This secret mode proves that even serious study apps can have a sense of humor! Keep exploring and keep learning! 🚀✨"
        : "Great question! I'd be happy to help you learn more about that topic."
      
      const newChat = { question, answer: partyResponse }
      setChatHistory(prev => [...prev, newChat])
      setAnswer(partyResponse)
      setQuestion('')
      setLoading(false)
    }, 1000)
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

  // Party mode styles with cosmic theme
  const partyStyles = partyMode ? {
    animation: 'cosmic 4s ease-in-out infinite, twinkle 2s linear infinite',
    background: 'radial-gradient(ellipse at top, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
    backgroundSize: '400% 400%',
    position: 'relative'
  } : {}

  const cosmicStyles = !partyMode ? {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
  } : {}

  return (
    <div className={`min-h-screen transition-all duration-1000 relative overflow-hidden`} 
         style={partyMode ? partyStyles : cosmicStyles}>
      
      {/* Cosmic stars and particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Stars */}
        <div className="stars">
          {[...Array(100)].map((_, i) => (
            <div key={`star-${i}`} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
        
        {/* Floating particles for party mode */}
        {partyMode && (
          <div className="cosmic-particles">
            {[...Array(30)].map((_, i) => (
              <div key={`particle-${i}`} className="cosmic-particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                backgroundColor: ['#00ffff', '#ff00ff', '#ffff00', '#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 6)]
              }}></div>
            ))}
          </div>
        )}
        
        {/* Nebula effect */}
        <div className="nebula"></div>
      </div>

      {/* Easter egg notification */}
      {showEasterEgg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-lg animate-bounce">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉 PARTY MODE {partyMode ? 'ACTIVATED' : 'DEACTIVATED'} 🎉</div>
            <div className="text-sm opacity-75">Your team found the secret! Type "party" anytime to toggle!</div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold text-white mb-4 transition-all duration-500 ${partyMode ? 'animate-pulse text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400'}`}>
            📚 LearnAI {partyMode ? '✨🌌🚀💫' : ''}
          </h1>
          <p className={`text-cyan-200/80 text-lg ${partyMode ? 'animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400' : ''}`}>
            {partyMode ? '🌟 AI-Powered Cosmic Learning Experience! 🌟' : '🌌 AI-Powered Educational Tools'}
          </p>
          {partyMode && (
            <div className="mt-2 text-cyan-300/70 text-sm animate-pulse">
              🤫 Psst... someone activated cosmic party mode! 
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`backdrop-blur-sm rounded-lg p-2 flex space-x-2 transition-all duration-500 ${
            partyMode ? 'bg-white/30 shadow-2xl animate-pulse' : 'bg-white/20'
          }`}>
            {[
              { id: 'flashcards', label: partyMode ? '🎪 Party Cards' : '🃏 Flashcards', desc: partyMode ? 'Fun Learning' : 'Make Flashcards' },
              { id: 'quiz', label: partyMode ? '🎯 Fun Quiz' : '📝 Quiz', desc: partyMode ? 'Party Trivia' : 'Create Quiz' },
              { id: 'study-buddy', label: partyMode ? '🤖 Party Bot' : '🤖 Study Buddy', desc: partyMode ? 'Dance & Learn' : 'Ask Questions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${partyMode ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg scale-110 animate-pulse' : 'bg-white text-purple-600 shadow-lg'}`
                    : `text-white hover:bg-white/10 ${partyMode ? 'hover:scale-105' : ''}`
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
            <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-500 ${
              partyMode ? 'bg-white/20 shadow-2xl animate-pulse' : 'bg-white/10'
            }`}>
              <h2 className={`text-2xl font-bold text-white mb-4 ${partyMode ? 'animate-bounce' : ''}`}>
                {partyMode ? '🎪 Party Card Maker' : '🃏 Flashcard Maker'}
              </h2>
              
              {flashcards.length === 0 ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={partyMode ? "Drop your notes and let's make some party cards! 🎉" : "Paste your study notes here and I'll create flashcards for you..."}
                    className={`w-full h-40 p-4 rounded-lg border-0 text-white placeholder-white/60 focus:ring-2 transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 focus:ring-pink-400/50 shadow-lg' : 'bg-white/20 focus:ring-white/30'
                    }`}
                  />
                  <button
                    onClick={generateFlashcards}
                    disabled={loading || !notes.trim()}
                    className={`mt-4 px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {loading ? (partyMode ? '✨ Creating Magic...' : 'Generating...') : (partyMode ? '🎉 Make Party Cards!' : 'Generate Flashcards')}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-white">
                    Card {currentCard + 1} of {flashcards.length} {partyMode ? '🎊' : ''}
                  </div>
                  
                  <div 
                    className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer transition-all duration-500 ${
                      partyMode ? 'hover:scale-105 shadow-2xl' : ''
                    }`}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="flashcard-inner">
                      <div className={`flashcard-front ${partyMode ? 'bg-gradient-to-br from-purple-400/90 to-pink-500/90' : ''}`}>
                        <p className="text-lg font-medium">{flashcards[currentCard]?.front}</p>
                      </div>
                      <div className={`flashcard-back ${partyMode ? 'bg-gradient-to-br from-pink-500/90 to-purple-400/90' : ''}`}>
                        <p className="text-lg">{flashcards[currentCard]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentCard === 0}
                      className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-all duration-300 ${
                        partyMode ? 'bg-gradient-to-r from-blue-400 to-blue-600 hover:scale-105' : 'bg-white/20'
                      }`}
                    >
                      Previous {partyMode ? '⬅️' : ''}
                    </button>
                    <button
                      onClick={() => setFlashcards([])}
                      className={`px-4 py-2 text-white rounded-lg transition-all duration-300 ${
                        partyMode ? 'bg-gradient-to-r from-red-400 to-red-600 hover:scale-105' : 'bg-red-500'
                      }`}
                    >
                      {partyMode ? '🎪 New Party Cards' : 'New Flashcards'}
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCard === flashcards.length - 1}
                      className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-all duration-300 ${
                        partyMode ? 'bg-gradient-to-r from-green-400 to-green-600 hover:scale-105' : 'bg-white/20'
                      }`}
                    >
                      Next {partyMode ? '➡️' : ''}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-500 ${
              partyMode ? 'bg-white/20 shadow-2xl animate-pulse' : 'bg-white/10'
            }`}>
              <h2 className={`text-2xl font-bold text-white mb-4 ${partyMode ? 'animate-bounce' : ''}`}>
                {partyMode ? '🎯 Party Quiz Maker' : '📝 Quiz Maker'}
              </h2>
              
              {quiz.length === 0 && !showResults ? (
                <div>
                  <textarea
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder={partyMode ? "Let's turn your text into a fun quiz party! 🎊" : "Paste text here and I'll create a quiz for you..."}
                    className={`w-full h-40 p-4 rounded-lg border-0 text-white placeholder-white/60 focus:ring-2 transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-green-500/30 to-blue-500/30 focus:ring-blue-400/50 shadow-lg' : 'bg-white/20 focus:ring-white/30'
                    }`}
                  />
                  <button
                    onClick={generateQuiz}
                    disabled={loading || !quizText.trim()}
                    className={`mt-4 px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {loading ? (partyMode ? '🎪 Creating Fun...' : 'Creating Quiz...') : (partyMode ? '🎯 Start Quiz Party!' : 'Create Quiz')}
                  </button>
                </div>
              ) : showResults ? (
                <div className={`text-center ${partyMode ? 'animate-pulse' : ''}`}>
                  <h3 className={`text-3xl font-bold text-white mb-4 ${partyMode ? 'animate-bounce' : ''}`}>
                    {partyMode ? '🎉 Quiz Party Complete! 🎉' : 'Quiz Complete!'}
                  </h3>
                  <p className="text-xl text-white mb-6">
                    You scored {score} out of {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                    {partyMode && score === quiz.length && ' 🏆 PARTY CHAMPION! 🏆'}
                  </p>
                  <button
                    onClick={() => {
                      setQuiz([])
                      setShowResults(false)
                      setScore(0)
                    }}
                    className={`px-6 py-3 text-white rounded-lg transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 shadow-lg' : 'bg-blue-500'
                    }`}
                  >
                    {partyMode ? '🎪 Another Party Quiz!' : 'Take Another Quiz'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-white">
                    Question {currentQuestion + 1} of {quiz.length} {partyMode ? '🎯' : ''}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className={`text-xl font-bold text-white mb-4 ${partyMode ? 'animate-pulse' : ''}`}>
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
                              ? `${partyMode ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 hover:scale-105 shadow-lg' : 'bg-white/20 hover:bg-white/30'} text-white`
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
                      <div className={`mt-4 p-4 rounded-lg transition-all duration-500 ${
                        partyMode ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 shadow-lg' : 'bg-white/20'
                      }`}>
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
            <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-500 ${
              partyMode ? 'bg-white/20 shadow-2xl animate-pulse' : 'bg-white/10'
            }`}>
              <h2 className={`text-2xl font-bold text-white mb-4 ${partyMode ? 'animate-bounce' : ''}`}>
                {partyMode ? '🤖 Party Bot Study Buddy' : '🤖 Ask-Me Study Buddy'}
              </h2>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={partyMode ? "Ask me anything - I'm in party mode! 🎉" : "Ask me anything you want to learn about..."}
                    className={`flex-1 p-4 rounded-lg border-0 text-white placeholder-white/60 focus:ring-2 transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 focus:ring-purple-400/50 shadow-lg' : 'bg-white/20 focus:ring-white/30'
                    }`}
                    onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                  />
                  <button
                    onClick={askStudyBuddy}
                    disabled={loading || !question.trim()}
                    className={`px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105' : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    {loading ? (partyMode ? '🎪 Partying...' : 'Thinking...') : (partyMode ? '🎉 Ask!' : 'Ask')}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className={`p-4 rounded-lg transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 shadow-lg' : 'bg-blue-500/20'
                    }`}>
                      <p className="text-white font-medium">You:</p>
                      <p className="text-white/90">{chat.question}</p>
                    </div>
                    <div className={`p-4 rounded-lg transition-all duration-300 ${
                      partyMode ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 shadow-lg' : 'bg-green-500/20'
                    }`}>
                      <p className="text-white font-medium">{partyMode ? 'Party Buddy 🎉:' : 'Study Buddy:'}</p>
                      <p className="text-white/90">{chat.answer}</p>
                    </div>
                  </div>
                ))}
                
                {chatHistory.length === 0 && (
                  <div className={`text-center text-white/60 py-8 ${partyMode ? 'animate-pulse' : ''}`}>
                    {partyMode 
                      ? "🎉 Ready to party and learn? Ask me anything and let's make studying fun! 🚀"
                      : "Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions."
                    }
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden instruction for your team */}
      <div className="fixed bottom-2 right-2 text-xs text-white/30 select-none pointer-events-none">
        💡 Try typing "party"
      </div>

      <style jsx>{`
        @keyframes cosmic {
          0%, 100% { 
            background-position: 0% 50%;
            filter: hue-rotate(0deg) brightness(1);
          }
          25% {
            background-position: 100% 50%;
            filter: hue-rotate(90deg) brightness(1.2);
          }
          50% { 
            background-position: 50% 100%;
            filter: hue-rotate(180deg) brightness(0.8);
          }
          75% {
            background-position: 0% 100%;
            filter: hue-rotate(270deg) brightness(1.1);
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s linear infinite;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        }

        .star:nth-child(2n) {
          width: 1px;
          height: 1px;
          background: #00ffff;
          box-shadow: 0 0 4px rgba(0, 255, 255, 0.8);
        }

        .star:nth-child(3n) {
          width: 3px;
          height: 3px;
          background: #ff00ff;
          box-shadow: 0 0 8px rgba(255, 0, 255, 0.8);
        }

        .nebula {
          position: absolute;
          top: 20%;
          right: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, rgba(72, 61, 139, 0.2) 40%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          animation: float 8s ease-in-out infinite alternate;
        }

        .nebula:after {
          content: '';
          position: absolute;
          top: -50px;
          left: -50px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(30, 144, 255, 0.4) 0%, rgba(138, 43, 226, 0.2) 50%, transparent 70%);
          border-radius: 50%;
          filter: blur(60px);
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(5deg); }
        }

        .cosmic-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .cosmic-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: cosmic-float 4s ease-in-out infinite;
          box-shadow: 0 0 10px currentColor;
        }

        @keyframes cosmic-float {
          0%, 100% { 
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% {
            transform: translateY(50vh) translateX(100px) rotate(180deg);
            opacity: 1;
          }
        }

        .flashcard {
          width: 100%;
          height: 200px;
          perspective: 1000px;
        }

        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .flashcard.flipped .flashcard-inner {
          transform: rotateY(180deg);
        }

        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
        }

        .flashcard-back {
          transform: rotateY(180deg);
        }

        .quiz-option.correct {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          color: white;
          border: 2px solid #34d399;
        }

        .quiz-option.incorrect {
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          color: white;
          border: 2px solid #f87171;
        }

        .confetti {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #ff6b6b;
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}