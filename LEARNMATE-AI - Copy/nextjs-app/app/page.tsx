'use client'

import { useState } from 'react'

type Flashcard = {
  front: string
  back: string
}

export default function Home() {
  const [notes, setNotes] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState<number[]>([])

  const handleGenerate = async () => {
    setLoading(true)
    setFlashcards([])
    setFlipped([])
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    const data = await res.json()
    setFlashcards(data.flashcards || [])
    setLoading(false)
  }

  const handleFlip = (idx: number) => {
    setFlipped(f =>
      f.includes(idx) ? f.filter(i => i !== idx) : [...f, idx]
    )
  }

  return (
    <div>
      <label className="block mb-2 text-base font-bold text-pink-600">
        <span role="img" aria-label="notes">📝</span> Paste your notes:
      </label>
      <textarea
        className="w-full p-4 border-2 mb-2"
        rows={5}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Type or paste your notes here... (Gen Z style!)"
      />
      <button
        className="genz-btn w-full"
        onClick={handleGenerate}
        disabled={loading || !notes.trim()}
      >
        {loading ? 'Generating...' : '✨ Generate Flashcards'}
      </button>

      {flashcards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center gap-2">
            <span role="img" aria-label="flash">⚡</span> Flashcards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {flashcards.map((card, idx) => (
              <div
                key={idx}
                className={`flashcard ${flipped.includes(idx) ? 'flipped' : ''}`}
                onClick={() => handleFlip(idx)}
                tabIndex={0}
                aria-label="Flip flashcard"
              >
                <div className="flashcard-inner">
                  <div className="flashcard-front">
                    <span role="img" aria-label="question">🤔</span>
                    <span className="ml-2">{card.front}</span>
                  </div>
                  <div className="flashcard-back">
                    <span role="img" aria-label="answer">💡</span>
                    <span className="ml-2">{card.back}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            <span role="img" aria-label="tip">👆</span> Tap any card to flip!
          </p>
        </div>
      )}
    </div>
  )
}