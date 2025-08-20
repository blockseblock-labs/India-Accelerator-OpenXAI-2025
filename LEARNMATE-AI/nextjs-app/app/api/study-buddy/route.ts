import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a helpful study buddy AI. Answer the following question in a clear, educational way. Provide explanations, examples, and encourage learning. Be friendly and supportive.

Question: ${question}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
      throw new Error('Failed to get response from OpenRouter API')
    }

    const data = await response.json()

    return NextResponse.json({
      answer: data.choices?.[0]?.message?.content || 'I could not process your question. Please try again!',
    })
  } catch (error) {
    console.error('Study Buddy API error:', error)
    return NextResponse.json(
      { error: 'Failed to get study buddy response' },
      { status: 500 }
    )
  }
}
