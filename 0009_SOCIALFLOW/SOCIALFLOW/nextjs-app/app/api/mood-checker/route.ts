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

    const prompt = `Analyze the mood and sentiment of the following text: "${text}"

Classify the mood as one of these options: happy, sad, angry, excited, neutral, anxious, love, frustrated

Respond with ONLY the mood word, nothing else. Pick the best single word that describes the overall sentiment.`

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
    
    // Clean up the response to get just the mood
    let mood = data.response?.toLowerCase().trim() || 'neutral'
    
    // Extract just the first word if there are multiple words
    mood = mood.split(' ')[0]
    
    // Map to emoji
    const moodEmojis: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'excited': '🤩',
      'neutral': '😐',
      'anxious': '😰',
      'love': '😍',
      'frustrated': '😤'
    }
    
    const emoji = moodEmojis[mood] || '😐'
    
    return NextResponse.json({ 
      mood: mood,
      emoji: emoji,
      confidence: 'high'
    })
  } catch (error) {
    console.error('Mood Checker API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze mood' },
      { status: 500 }
    )
  }
} 