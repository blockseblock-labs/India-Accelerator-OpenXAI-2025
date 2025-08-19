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

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      answer: data.response || 'I could not process your question. Please try again!' 
    })
  } catch (error) {
    console.error('Study Buddy API error:', error)
    return NextResponse.json(
      { error: 'Failed to get study buddy response' },
      { status: 500 }
    )
  }
} 