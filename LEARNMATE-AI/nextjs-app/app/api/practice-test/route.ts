import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    const prompt = `Create a comprehensive practice test from the following study material. Generate a practice test in JSON format with the following structure:
{
  "test": {
    "questions": [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Detailed explanation of why this answer is correct"
      }
    ],
    "timeLimit": 30,
    "difficulty": "Medium"
  }
}

Requirements:
- Create 10-15 multiple choice questions
- Each question should have 4 options (A, B, C, D)
- Include a mix of question types: factual recall, conceptual understanding, and application
- Provide detailed explanations for correct answers
- Set appropriate time limit in minutes (20-45 minutes depending on content complexity)
- Assign difficulty level: "Easy", "Medium", or "Hard"
- Focus on the most important concepts and information for testing knowledge
- Make distractors (wrong answers) plausible but clearly incorrect
- Ensure questions test different aspects of the material

Study material: ${text}`

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
      // Try to parse JSON from the response
      const testMatch = data.response.match(/\{[\s\S]*\}/)
      if (testMatch) {
        const testData = JSON.parse(testMatch[0])
        return NextResponse.json(testData)
      }
    } catch (parseError) {
      console.log('Could not parse JSON, returning formatted response')
    }

    // Fallback: create a simple test structure from the response
    const responseText = data.response || 'No response from model'
    const fallbackQuestions = []
    
    // Try to extract some basic questions from the response
    const lines = responseText.split('\n').filter(line => line.trim())
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (lines[i].includes('?') || lines[i].toLowerCase().includes('what') || lines[i].toLowerCase().includes('how')) {
        fallbackQuestions.push({
          question: lines[i].trim(),
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "This is the correct answer based on the study material."
        })
      }
    }

    // If no questions were extracted, create generic ones
    if (fallbackQuestions.length === 0) {
      fallbackQuestions.push({
        question: "Based on the study material provided, which statement is most accurate?",
        options: [
          "The information covers important concepts",
          "The content is not relevant",
          "No useful information was provided",
          "The material is too complex"
        ],
        correct: 0,
        explanation: "The study material contains relevant information for learning."
      })
    }

    return NextResponse.json({
      test: {
        questions: fallbackQuestions,
        timeLimit: 20,
        difficulty: "Medium"
      }
    })
  } catch (error) {
    console.error('Practice Test API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate practice test' },
      { status: 500 }
    )
  }
}