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

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest', // works because we confirmed this exists
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get response from Ollama: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Ollama raw output:", data) // <-- Debug output

    let flashcardsData

    try {
      // Match the first {...} block in the AI's output
      const flashcardsMatch = data.response?.match(/\{[\s\S]*\}/)
      if (flashcardsMatch) {
        flashcardsData = JSON.parse(flashcardsMatch[0])
      }
    } catch (parseError) {
      console.error("JSON parse failed:", parseError)
    }

    if (flashcardsData) {
      return NextResponse.json(flashcardsData)
    }

    // Fallback if parsing failed
    return NextResponse.json({
      flashcards: [
        {
          front: "Generated from your notes",
          back: data.response || 'No structured JSON found in model output'
        }
      ]
    })
  } catch (error: any) {
    console.error('Flashcards API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards', details: error.message },
      { status: 500 }
    )
  }
}
