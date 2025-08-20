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

    const prompt = `Analyze the emotion and sentiment of the following text: "${text}"

Classify the emotion as one of these options: happy, sad, angry, excited, neutral, anxious, love, frustrated

Respond with ONLY the emotion word, nothing else. Pick the best single word that describes the overall sentiment.`

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
    
    // Clean up the response to get just the emotion
    let emotion = data.response?.toLowerCase().trim() || 'neutral'
    
    // Extract just the first word if there are multiple words
    emotion = emotion.split(' ')[0]
    
    // Map to emoji
    const emotionEmojis: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'excited': '🤩',
      'neutral': '😐',
      'anxious': '😰',
      'love': '😍',
      'frustrated': '😤'
    }
    
    const emoji = emotionEmojis[emotion] || '😐'
    
    return NextResponse.json({ 
      emotion: emotion,
      emoji: emoji,
      confidence: 'high'
    })
  } catch (error) {
    console.error('Emotion Checker API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze emotion' },
      { status: 500 }
    )
  }
}