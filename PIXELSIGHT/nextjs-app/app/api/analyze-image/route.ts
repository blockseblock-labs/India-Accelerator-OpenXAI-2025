import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const imageDataUrl = body.image

    if (!imageDataUrl) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY environment variable is required' }, { status: 500 })
    }

    // Converting image into base64 for transfering the data
    const [header, base64Data] = imageDataUrl.split(',')
    const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please provide a detailed analysis of this image. Describe what you see, identify any objects, people, or activities, and provide insights about the context or setting.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Groq API error:', errorData)
      throw new Error(`Failed to get response from Groq: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.choices?.[0]?.message?.content || 'No analysis available'
    
    return NextResponse.json({ 
      analysis: analysis,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      confidence: 0.85
    })
  } catch (error) {
    console.error('Image analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
} 