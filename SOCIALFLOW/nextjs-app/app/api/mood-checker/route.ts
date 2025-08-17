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

    // Step 1: Get base URL from env or default to 11434
    let baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'

    // Step 2: Check if current URL works, otherwise try 11435
    try {
      const test = await fetch(`${baseUrl}/api/tags`)
      if (!test.ok) throw new Error()
    } catch {
      baseUrl = 'http://localhost:11435'
    }

    // Step 3: Make request to Ollama
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get response from Ollama at ${baseUrl}`)
    }

    const data = await response.json()

    // Step 4: Clean up the response to get just the mood
    let mood = data.response?.toLowerCase().trim() || 'neutral'
    mood = mood.split(' ')[0] // First word only

    // Step 5: Map to emoji
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
      mood,
      emoji,
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
