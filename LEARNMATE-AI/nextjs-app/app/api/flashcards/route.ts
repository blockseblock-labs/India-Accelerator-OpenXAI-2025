// import { NextRequest, NextResponse } from 'next/server'

// export async function POST(req: NextRequest) {
//   try {
//     const { notes } = await req.json()

//     if (!notes) {
//       return NextResponse.json(
//         { error: 'Notes are required' },
//         { status: 400 }
//       )
//     }

//     const prompt = `Create flashcards from the following notes. Generate 5-8 flashcards in JSON format with the following structure:
// {
//   "flashcards": [
//     {
//       "front": "Question or term",
//       "back": "Answer or definition"
//     }
//   ]
// }

// Focus on key concepts, definitions, and important facts. Make questions clear and answers concise.

// Notes: ${notes}`

//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'llama3.2:1b',
//         prompt: prompt,
//         stream: false,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to get response from Ollama')
//     }

//     const data = await response.json()
    
//     try {
//       // Try to parse JSON from the response
//       const flashcardsMatch = data.response.match(/\{[\s\S]*\}/)
//       if (flashcardsMatch) {
//         const flashcardsData = JSON.parse(flashcardsMatch[0])
//         return NextResponse.json(flashcardsData)
//       }
//     } catch (parseError) {
//       // If JSON parsing fails, return a structured response
//       console.log('Could not parse JSON, returning formatted response')
//     }

//     // Fallback: create a simple structure from the response
//     return NextResponse.json({
//       flashcards: [
//         {
//           front: "Generated from your notes",
//           back: data.response || 'No response from model'
//         }
//       ]
//     })
//   } catch (error) {
//     console.error('Flashcards API error:', error)
//     return NextResponse.json(
//       { error: 'Failed to generate flashcards' },
//       { status: 500 }
//     )
//   }
// } 

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

    // 🔹 Together.ai API instead of localhost Ollama
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`, // from .env.local
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // or another Together model
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Together.ai')
    }

    const data = await response.json()
    const rawText = data.choices?.[0]?.message?.content || ''

    try {
      // Try to parse JSON flashcards directly from the model output
      const flashcardsMatch = rawText.match(/\{[\s\S]*\}/)
      if (flashcardsMatch) {
        const flashcardsData = JSON.parse(flashcardsMatch[0])
        return NextResponse.json(flashcardsData)
      }
    } catch (parseError) {
      console.warn('Could not parse JSON, returning fallback')
    }

    // Fallback response if parsing fails
    return NextResponse.json({
      flashcards: [
        {
          front: 'Generated from your notes',
          back: rawText || 'No response from model',
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
