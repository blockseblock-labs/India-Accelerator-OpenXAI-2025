import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      )
    }

    const prompt = `Analyze this image and describe the key details clearly: ${imageUrl}`

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest', // make sure this exists in `ollama list`
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("Ollama HTTP error:", response.status, response.statusText, text)
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Ollama raw response:", data) // 🔥 Debug log

    return NextResponse.json({
      analysis: data.response || 'No response from Ollama',
    })
  } catch (error: any) {
    console.error('Analyze Image API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image', details: error.message },
      { status: 500 }
    )
  }
}
