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

    const prompt = `Analyze the sentiment of the following text: "${text}"

Classify the sentiment as one of these options: positive, negative, neutral.

Respond with ONLY the sentiment word.`

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
    
    let sentiment = data.response?.toLowerCase().trim() || 'neutral'
    sentiment = sentiment.split(' ')[0] // ensure only first word
    
    const sentimentEmojis: { [key: string]: string } = {
      'positive': '👍',
      'negative': '👎',
      'neutral': '😐'
    }
    
    const emoji = sentimentEmojis[sentiment] || '😐'
    
    return NextResponse.json({ 
      sentiment,
      emoji,
      confidence: 'high'
    })
  } catch (error) {
    console.error('Sentiment Checker API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}
