import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()  // base64 string from frontend

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
    }

    // Ask Llama 3 to analyze the image (passing base64 snippet so it doesn’t overflow)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: `You are a computer vision assistant. 
Analyze this uploaded image (base64 provided).
Describe the scene, objects, and notable features in detail.

Image (truncated): ${image.substring(0, 150)}...`,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()

    return NextResponse.json({
      analysis: data.response || 'No analysis available',
    })
  } catch (error) {
    console.error('Image analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
