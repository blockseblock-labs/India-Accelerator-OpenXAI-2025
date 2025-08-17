import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageDescription } = await req.json()

    if (!imageDescription) {
      return NextResponse.json(
        { error: 'Image description is required' },
        { status: 400 }
      )
    }

    const prompt = `Create an engaging Instagram caption for an image with the following description: "${imageDescription}"

The caption should be:
- Fun and engaging
- Include relevant emojis
- Be 1-2 sentences long
- Perfect for social media sharing
- Creative and attention-grabbing

Generate just the caption, no extra text or explanations.`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      caption: data.response || 'Unable to generate caption' 
    })
  } catch (error) {
    console.error('Caption Generator API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate caption' },
      { status: 500 }
    )
  }
} 