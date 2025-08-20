'use client'

import { useState } from 'react'

export default function Playground() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'summary' | 'translate' | 'explain' | 'story'>(
    'summary'
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setOutput('')

    let prompt = ''
if (mode === 'summary') {
  prompt = `Summarize the following text in one or two plain sentences. Return only the summary with no headings, no labels, no explanations, no quotes, and no parentheses:\n${input}`
} else if (mode === 'translate') {
  prompt = `Translate the following text into Hindi. Return only the translated sentence with no explanation, no heading, no quotes, and no parentheses:\n${input}`
} else if (mode === 'explain') {
  prompt = `Explain the following text in simple plain English. Return only the explanation with no headings, no labels, no extra notes, and no parentheses:\n${input}`
} else if (mode === 'story') {
  prompt = `Write a short story about the following text in plain sentences. Return only the story with no headings, no introduction, no extra notes, and no punctuation aside from normal sentence punctuation:\n${input}`
}

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader!.read()
      done = doneReading
      const chunk = decoder.decode(value, { stream: true })
      setOutput((prev) => prev + chunk)
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 AI Prompt Playground</h1>

      <textarea
  className="w-full bg-white/20 border border-white/30 rounded-lg p-3 mb-4 resize-none focus:outline-none"
  rows={6}
  placeholder={
    mode === 'summary'
      ? 'Enter text to summarize...'
      : mode === 'translate'
      ? 'Enter text to translate...'
      : mode === 'explain'
      ? 'Enter text to explain...'
      : 'Enter topic for the story...'
  }
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>


        <div className="flex items-center space-x-4 mb-4">
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg p-2"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="summary">Summarize</option>
            <option value="translate">Translate to Hindi</option>
            <option value="explain">Explain Simply</option>
            <option value="story">Story Mode</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 px-4 py-2 rounded-lg"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="w-full bg-white/20 border border-white/30 rounded-lg p-3 mb-4 resize-none focus:outline-none">
          {output || 'Output will appear here...'}
        </div>
      </div>
    </main>
  )
}
