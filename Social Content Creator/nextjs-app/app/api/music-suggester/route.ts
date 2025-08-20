import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { caption, mood, platform } = await req.json()

    if (!caption && !mood) {
      return NextResponse.json(
        { error: 'Provide at least caption or mood' },
        { status: 400 }
      )
    }

    const prompt = `You are a social media background music adviser.
Suggest 5 royalty-free background music tracks for a ${platform || 'Instagram'} post.
Consider the following context:
Caption: "${caption || '(none)'}"
Mood: "${mood || 'auto'}"

Return ONLY a JSON array of objects:
[
  { "title": string, "genre": string, "bpm": number, "vibe": string, "keywords": string, "drop": number }
]`

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
    
    let tracks = []
    if (data.response) {
      try {
        const jsonStart = data.response.indexOf('[')
        const jsonEnd = data.response.lastIndexOf(']') + 1
        const slice = jsonStart !== -1 && jsonEnd !== -1 ? data.response.slice(jsonStart, jsonEnd) : data.response
        tracks = JSON.parse(slice)
      } catch {
        tracks = [{
          title: 'Chill Beat',
          genre: 'Lo-fi',
          bpm: 90,
          vibe: 'relaxing, mellow',
          keywords: 'lofi, chillhop, royalty-free',
          drop: 10,
        }]
      }
    }

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error('Music Suggester API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate music suggestions' },
      { status: 500 }
    )
  }
}
