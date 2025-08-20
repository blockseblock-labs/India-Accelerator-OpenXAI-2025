import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      throw new Error('Missing OpenRouter API Key')
    }

    const prompt = `
Create 10 multiple choice questions from the following text.
Output should be only valid JSON in this exact format:

{
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Explanation for correct answer"
    }
  ]
}

Text:
${text}
`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'LearnMate AI',
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      throw new Error('Failed to get response from OpenRouter API')
    }

    const data = await response.json()

    const completion = data.choices?.[0]?.message?.content || ""

    const jsonMatch = completion.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      try {
        const quizData = JSON.parse(jsonMatch)
        return NextResponse.json(quizData)
      } catch {
        console.log("Failed to parse JSON from AI response")
      }
    }

    // Fallback if parsing fails
    return NextResponse.json({
      quiz: [
        {
          question: "Could not parse quiz from AI response",
          options: ["Try again", "Check input", "Contact support", "Other"],
          correct: 0,
          explanation: completion || "No valid response received",
        },
      ],
    })

  } catch (error) {
    console.error('Quiz API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
