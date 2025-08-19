import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()

    if (!notes) {
      return NextResponse.json(
        { error: 'Notes are required' },
        { status: 400 }
      )
    }

    const prompt = `Create flashcards from the following notes. Generate 5-8 flashcards in JSON format with the following structure:
{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Focus on key concepts, definitions, and important facts. Make questions clear and answers concise.

Notes: ${notes}`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral:latest',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    try {
      // Try to parse JSON from the response
      const flashcardsMatch = data.response.match(/\{[\s\S]*\}/)
      if (flashcardsMatch) {
        const flashcardsData = JSON.parse(flashcardsMatch[0])
        return NextResponse.json(flashcardsData)
      }
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      console.log('Could not parse JSON, returning formatted response')
    }

    // Fallback: create a simple structure from the response
    return NextResponse.json({
      flashcards: [
        {
          front: "Generated from your notes",
          back: data.response || 'No response from model'
        }
      ]
    })
  } catch (error) {
    console.error('Flashcards API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
} 