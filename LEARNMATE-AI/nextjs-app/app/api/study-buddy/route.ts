import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const prompt = `You are a helpful study buddy AI. 
Answer the following question in a clear, educational, and supportive way. 
- Provide explanations with examples when possible.  
- Encourage learning and curiosity.  
- Be concise but thorough.  

Question: ${question}`

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
        { error: 'Failed to connect to AI model' },
        { status: 502 }
      )
    }

    const data = await response.json()

    // Ensure safe return of response
    const answer =
      (typeof data.response === 'string' && data.response.trim().length > 0)
        ? data.response.trim()
        : 'I could not generate a proper answer. Please try asking in a different way!'

    return NextResponse.json({ answer })

  } catch (error) {
    console.error('Study Buddy API error:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating study buddy response' },
      { status: 500 }
    )
  }
}
