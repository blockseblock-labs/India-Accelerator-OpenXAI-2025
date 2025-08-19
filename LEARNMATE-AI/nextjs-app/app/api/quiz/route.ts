import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const prompt = `Create a quiz from the following text. 
Generate 4-6 multiple choice questions in strict JSON format with this structure only:
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

- Make questions challenging but fair.  
- Ensure options are plausible.  
- Return ONLY valid JSON, no extra text.  

Text: ${text}`

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

    // Try strict JSON extraction
    try {
      const quizMatch = data.response.match(/\{[\s\S]*\}/)
      if (quizMatch) {
        const quizData = JSON.parse(quizMatch[0])
        if (quizData.quiz && Array.isArray(quizData.quiz)) {
          return NextResponse.json(quizData)
        }
      }
    } catch (parseError) {
      console.warn('JSON parsing failed, using fallback quiz response')
    }

    // Fallback: simple structured quiz
    return NextResponse.json({
      quiz: [
        {
          question: "What is the main topic of the provided text?",
          options: ["Topic A", "Topic B", "Topic C", "Topic D"],
          correct: 0,
          explanation: data.response?.slice(0, 300) || 'Generated from your text',
        },
      ],
    })

  } catch (error) {
    console.error('Quiz API error:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating quiz' },
      { status: 500 }
    )
  }
}
