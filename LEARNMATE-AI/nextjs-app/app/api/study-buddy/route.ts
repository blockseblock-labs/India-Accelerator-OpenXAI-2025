import { NextRequest, NextResponse } from 'next/server'
import Together from "together-ai"

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // make sure .env.local has TOGETHER_API_KEY=your_key_here
})

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a helpful study buddy AI. Answer the following question in a clear, educational way. 
    Provide explanations, examples, and encourage learning. Be friendly and supportive.

    Question: ${question}`

    // Call Together AI
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", // good model for Q&A
      messages: [
        { role: "user", content: prompt }
      ],
    })

    return NextResponse.json({ 
      answer: response.choices[0]?.message?.content || 
              "I could not process your question. Please try again!" 
    })

  } catch (error) {
    console.error('Study Buddy API error:', error)
    return NextResponse.json(
      { error: 'Failed to get study buddy response' },
      { status: 500 }
    )
  }
}
