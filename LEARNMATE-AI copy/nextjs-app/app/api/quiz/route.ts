import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, difficulty = "medium", previousScore } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    let difficultyInstruction = ""
    let timeLimit = 60
    if (difficulty === "easy") {
      difficultyInstruction = "Make questions simple with straightforward options."
      timeLimit = 90
    }
    if (difficulty === "medium") {
      difficultyInstruction = "Make questions moderately challenging with tricky distractors."
      timeLimit = 60
    }
    if (difficulty === "hard") {
      difficultyInstruction = "Make questions highly challenging with very close options."
      timeLimit = 45
    }

    if (previousScore !== undefined) {
      if (previousScore >= 80) {
        difficultyInstruction = "Increase difficulty to hard"
        timeLimit = 45
      } else if (previousScore <= 40) {
        difficultyInstruction = "Reduce difficulty to easy"
        timeLimit = 90
      } else {
        difficultyInstruction = "Keep difficulty medium"
        timeLimit = 60
      }
    }

    const prompt = `Create a quiz from the following text. Generate 4-6 multiple choice questions in JSON format with the following structure:
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
${difficultyInstruction}

Text: ${text}`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    try {
      const quizMatch = data.response.match(/\{[\s\S]*\}/)
      if (quizMatch) {
        const quizData = JSON.parse(quizMatch[0])
        return NextResponse.json({ ...quizData, timeLimit })
      }
    } catch (parseError) {}

    return NextResponse.json({
      quiz: [
        {
          question: "What is the main topic of the provided text?",
          options: ["Topic A", "Topic B", "Topic C", "Topic D"],
          correct: 0,
          explanation: data.response || 'Generated from your text'
        }
      ],
      timeLimit
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}