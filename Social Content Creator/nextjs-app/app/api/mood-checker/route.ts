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

    const prompt = `You are a social media sentiment analyzer.
Analyze the following text and determine its overall mood and sentiment:

Text: "${text}"

Return a JSON object in this format:
{
  "mood": "one of happy, sad, angry, excited, neutral, anxious, love, frustrated",
  "emoji": "corresponding emoji",
  "confidence": "high"
}

Pick the best single mood that describes the overall sentiment. Respond ONLY with JSON.`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) throw new Error('Failed to get response from Ollama')

    const data = await response.json()

    let mood = 'neutral'
    let emoji = '😐'
    const confidence = 'high'

    if (data.response) {
      try {
        // Try to parse JSON from response
        const jsonStart = data.response.indexOf('{')
        const jsonEnd = data.response.lastIndexOf('}') + 1
        const slice = jsonStart !== -1 && jsonEnd !== -1 ? data.response.slice(jsonStart, jsonEnd) : data.response
        const parsed = JSON.parse(slice)
        mood = parsed.mood?.toLowerCase() || 'neutral'
        emoji = parsed.emoji || '😐'
      } catch {
        // Fallback: simple keyword mapping
        const firstWord = data.response.toLowerCase().trim().split(' ')[0]
        mood = firstWord || 'neutral'
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
        emoji = moodEmojis[mood] || '😐'
      }
    }

    return NextResponse.json({ mood, emoji, confidence })
  } catch (error) {
    console.error('Mood Checker API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze mood' },
      { status: 500 }
    )
  }
}
