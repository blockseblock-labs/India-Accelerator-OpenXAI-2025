import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()

    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return NextResponse.json(
        { error: 'Notes are required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const prompt = `Create flashcards from the following notes. 
Generate 5-8 flashcards in strict JSON format with this structure only:
{
  "flashcards": [
    { "front": "Question or term", "back": "Answer or definition" }
  ]
}

- Focus on key concepts, definitions, and important facts.
- Make questions clear and answers concise.
- Do NOT include explanations outside JSON.

Notes: ${notes}`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      console.error(`Ollama API Error: ${response.statusText}`)
      return NextResponse.json(
        { error: 'Failed to get response from Ollama API' },
        { status: 502 }
      )
    }

    const data = await response.json()

    // Try extracting JSON strictly
    try {
      const flashcardsMatch = data.response.match(/\{[\s\S]*\}/)
      if (flashcardsMatch) {
        const flashcardsData = JSON.parse(flashcardsMatch[0])
        if (flashcardsData.flashcards && Array.isArray(flashcardsData.flashcards)) {
          return NextResponse.json(flashcardsData)
        }
      }
    } catch (parseError) {
      console.warn('JSON parsing failed, using fallback response')
    }

    // Fallback: structured safe response
    return NextResponse.json({
      flashcards: [
        {
          front: "Generated Summary",
          back: data.response?.slice(0, 300) || 'No response from model',
        },
      ],
    })

  } catch (error) {
    console.error('Flashcards API error:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating flashcards' },
      { status: 500 }
    )
  }
}
