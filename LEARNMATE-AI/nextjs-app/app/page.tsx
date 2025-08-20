'use client'

import { useState } from 'react'

// Type definitions for our learning modules
interface MemoryPalette {
  front: string
  back: string
}

interface AssessmentProtocol {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export default function CyberMindTutor() {
  const [activeModule, setActiveModule] = useState('palettes')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // States for Memory Palettes (formerly Flashcards)
  const [knowledgeInput, setKnowledgeInput] = useState('')
  const [memoryPalettes, setMemoryPalettes] = useState<MemoryPalette[]>([])
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  
  // States for Assessment Protocol (formerly Quiz)
  const [assessmentMaterial, setAssessmentMaterial] = useState('')
  const [assessmentProtocols, setAssessmentProtocols] = useState<AssessmentProtocol[]>([])
  const [currentProtocolIndex, setCurrentProtocolIndex] = useState(0)
  const [chosenResponse, setChosenResponse] = useState<number | null>(null)
  const [displayOutcome, setDisplayOutcome] = useState(false)
  const [performanceMetric, setPerformanceMetric] = useState(0)
  
  // States for Digital Mentor (formerly Study Buddy)
  const [userInquiry, setUserInquiry] = useState('')
  const [mentorResponse, setMentorResponse] = useState('')
  const [dialogueLog, setDialogueLog] = useState<{question: string, answer: string}[]>([])

  const createMemoryPalettes = async () => {
    if (!knowledgeInput.trim()) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: knowledgeInput })
      })
      
      const data = await response.json()
      if (data.flashcards) {
        setMemoryPalettes(data.flashcards)
        setCurrentPaletteIndex(0)
        setIsRevealed(false)
      }
    } catch (error) {
      console.error('Error creating memory palettes:', error)
    }
    setIsProcessing(false)
  }

  const initiateAssessmentProtocol = async () => {
    if (!assessmentMaterial.trim()) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: assessmentMaterial })
      })
      
      const data = await response.json()
      if (data.quiz) {
        setAssessmentProtocols(data.quiz)
        setCurrentProtocolIndex(0)
        setChosenResponse(null)
        setDisplayOutcome(false)
        setPerformanceMetric(0)
      }
    } catch (error) {
      console.error('Error initiating assessment protocol:', error)
    }
    setIsProcessing(false)
  }

  const queryDigitalMentor = async () => {
    if (!userInquiry.trim()) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/study-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userInquiry })
      })
      
      const data = await response.json()
      if (data.answer) {
        const newDialogue = { question: userInquiry, answer: data.answer }
        setDialogueLog(prev => [...prev, newDialogue])
        setMentorResponse(data.answer)
        setUserInquiry('')
      }
    } catch (error) {
      console.error('Error querying digital mentor:', error)
    }
    setIsProcessing(false)
  }

  const advanceToNextPalette = () => {
    if (currentPaletteIndex < memoryPalettes.length - 1) {
      setCurrentPaletteIndex(currentPaletteIndex + 1)
      setIsRevealed(false)
    }
  }

  const returnToPreviousPalette = () => {
    if (currentPaletteIndex > 0) {
      setCurrentPaletteIndex(currentPaletteIndex - 1)
      setIsRevealed(false)
    }
  }

  const processResponse = (responseIndex: number) => {
    setChosenResponse(responseIndex)
    
    if (responseIndex === assessmentProtocols[currentProtocolIndex].correct) {
      setPerformanceMetric(performanceMetric + 1)
    }
    
    setTimeout(() => {
      if (currentProtocolIndex < assessmentProtocols.length - 1) {
        setCurrentProtocolIndex(currentProtocolIndex + 1)
        setChosenResponse(null)
      } else {
        setDisplayOutcome(true)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4 learn-gradient bg-clip-text text-transparent animate-pulse">
            CyberMind Tutor
          </h1>
          <p className="text-cyan-200/80 text-lg">AI-Enhanced Knowledge Assimilation</p>
        </header>

        {/* Module Selection Tabs */}
        <nav className="flex justify-center mb-8">
          <div className="bg-[rgba(18,18,18,0.5)] backdrop-blur-xl border border-cyan-500/20 rounded-lg p-2 flex space-x-2">
            {[
              { id: 'palettes', label: 'Memory Palettes', desc: 'Construct Knowledge Cards' },
              { id: 'assessment', label: 'Assessment', desc: 'Initiate Knowledge Test' },
              { id: 'mentor', label: 'Digital Mentor', desc: 'Query the AI' }
            ].map(module => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 text-white focus:outline-none ${
                  activeModule === module.id
                    ? 'bg-cyan-500/80 shadow-[0_0_15px_var(--primary-glow)]'
                    : 'bg-transparent hover:bg-cyan-500/20'
                }`}
              >
                <div className="text-sm font-semibold">{module.label}</div>
                <div className="text-xs opacity-75 hidden sm:block">{module.desc}</div>
              </button>
            ))}
          </div>
        </nav>

        {/* Content Display Area */}
        <main className="max-w-4xl mx-auto">
          {/* Memory Palettes Module */}
          {activeModule === 'palettes' && (
            <div className="bg-[rgba(18,18,18,0.5)] backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">Memory Palette Constructor</h2>
              
              {memoryPalettes.length === 0 ? (
                <div>
                  <textarea
                    value={knowledgeInput}
                    onChange={(e) => setKnowledgeInput(e.target.value)}
                    placeholder="Input raw data here. I will construct memory palettes for optimal retention..."
                    className="w-full h-48 p-4 rounded-lg border border-cyan-500/30 bg-black/30 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={createMemoryPalettes}
                    disabled={isProcessing || !knowledgeInput.trim()}
                    className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isProcessing ? 'Constructing...' : 'Construct Palettes'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-cyan-300">
                    Palette {currentPaletteIndex + 1} of {memoryPalettes.length}
                  </div>
                  
                  <div 
                    className={`flashcard ${isRevealed ? 'flipped' : ''} mb-6 cursor-pointer h-[200px]`}
                    onClick={() => setIsRevealed(!isRevealed)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <p className="text-xl font-semibold">{memoryPalettes[currentPaletteIndex]?.front}</p>
                      </div>
                      <div className="flashcard-back">
                        <p className="text-lg">{memoryPalettes[currentPaletteIndex]?.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={returnToPreviousPalette}
                      disabled={currentPaletteIndex === 0}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setMemoryPalettes([])}
                      className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600"
                    >
                      New Set
                    </button>
                    <button
                      onClick={advanceToNextPalette}
                      disabled={currentPaletteIndex === memoryPalettes.length - 1}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment Module */}
          {activeModule === 'assessment' && (
             <div className="bg-[rgba(18,18,18,0.5)] backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-green-300 mb-4">Assessment Protocol</h2>
              
              {assessmentProtocols.length === 0 && !displayOutcome ? (
                <div>
                  <textarea
                    value={assessmentMaterial}
                    onChange={(e) => setAssessmentMaterial(e.target.value)}
                    placeholder="Provide the subject material for assessment..."
                    className="w-full h-48 p-4 rounded-lg border border-green-500/30 bg-black/30 text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  <button
                    onClick={initiateAssessmentProtocol}
                    disabled={isProcessing || !assessmentMaterial.trim()}
                    className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isProcessing ? 'Initiating...' : 'Initiate Protocol'}
                  </button>
                </div>
              ) : displayOutcome ? (
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-4">Assessment Complete</h3>
                  <p className="text-2xl text-green-300 mb-6">
                    Performance Metric: {performanceMetric} / {assessmentProtocols.length} ({Math.round((performanceMetric / assessmentProtocols.length) * 100)}%)
                  </p>
                  <button
                    onClick={() => {
                      setAssessmentProtocols([])
                      setDisplayOutcome(false)
                      setPerformanceMetric(0)
                    }}
                    className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg"
                  >
                    Run New Assessment
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-green-300">
                    Query {currentProtocolIndex + 1} of {assessmentProtocols.length}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-6 p-4 bg-black/20 rounded-lg border border-green-500/20">
                      {assessmentProtocols[currentProtocolIndex]?.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {assessmentProtocols[currentProtocolIndex]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => processResponse(index)}
                          disabled={chosenResponse !== null}
                          className={`w-full p-4 text-left rounded-lg transition-all duration-300 quiz-option ${
                            chosenResponse === null
                              ? 'text-white'
                              : chosenResponse === index
                              ? index === assessmentProtocols[currentProtocolIndex].correct
                                ? 'correct'
                                : 'incorrect'
                              : index === assessmentProtocols[currentProtocolIndex].correct
                              ? 'correct'
                              : 'bg-white/5 text-white/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {chosenResponse !== null && (
                      <div className="mt-6 p-4 bg-black/30 rounded-lg border border-green-500/30">
                        <p className="text-green-300 font-semibold text-lg">Debrief:</p>
                        <p className="text-white/90">{assessmentProtocols[currentProtocolIndex]?.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Digital Mentor Module */}
          {activeModule === 'mentor' && (
            <div className="bg-[rgba(18,18,18,0.5)] backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-purple-300 mb-4">Digital Mentor Interface</h2>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userInquiry}
                    onChange={(e) => setUserInquiry(e.target.value)}
                    placeholder="Pose your query..."
                    className="flex-1 p-4 rounded-lg border border-purple-500/30 bg-black/30 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && queryDigitalMentor()}
                  />
                  <button
                    onClick={queryDigitalMentor}
                    disabled={isProcessing || !userInquiry.trim()}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isProcessing ? 'Processing...' : 'Query'}
                  </button>
                </div>
              </div>

              <div className="space-y-6 max-h-[50vh] overflow-y-auto p-4 rounded-lg bg-black/20">
                {dialogueLog.map((dialogue, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/20">
                      <p className="text-cyan-300 font-semibold">Your Query:</p>
                      <p className="text-white/90">{dialogue.question}</p>
                    </div>
                    <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                      <p className="text-purple-300 font-semibold">Mentor's Response:</p>
                      <p className="text-white/90">{dialogue.answer}</p>
                    </div>
                  </div>
                ))}
                
                {dialogueLog.length === 0 && (
                  <div className="text-center text-white/60 py-12">
                    <p className="text-lg">The Digital Mentor is online.</p>
                    <p>I can clarify concepts, generate examples, and elaborate on any subject.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}