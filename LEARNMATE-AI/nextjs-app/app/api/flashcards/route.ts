import { NextRequest, NextResponse } from 'next/server'
import Together from 'together-ai'

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // make sure this is in .env.local
})

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

    // Call Together AI
    const response = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', // good for text summarization
      messages: [
        { role: 'user', content: prompt }
      ],
    })

    // Attempt to parse JSON from the model response
    try {
      const flashcardsMatch = response.choices[0]?.message?.content?.match(/\{[\s\S]*\}/)
      if (flashcardsMatch) {
        const flashcardsData = JSON.parse(flashcardsMatch[0])
        return NextResponse.json(flashcardsData)
      }
    } catch (parseError) {
      console.log('Could not parse JSON, returning fallback response')
    }

    // Fallback response if parsing fails
    return NextResponse.json({
      flashcards: [
        {
          front: 'Generated from your notes',
          back: response.choices[0]?.message?.content || 'No response from model',
        },
      ],
    })

  } catch (error) {
    console.error('Flashcards API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
}