import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { keywords } = await req.json()

    if (!keywords) {
      return NextResponse.json(
        { error: 'Keywords are required' },
        { status: 400 }
      )
    }

    const prompt = `Generate relevant hashtags for social media content about: "${keywords}"

Create 8-12 hashtags that are:
- Relevant to the topic
- Popular and trending
- Mix of specific and broad hashtags
- Good for social media engagement

Format them as a simple list with # symbols, one per line. No explanations or extra text.`

    // Call Ollama (local Llama3 instance)
    const response = await fetch('http://localhost:11434/api/generate', {
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
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()

    // Extract hashtags
    let hashtags: string[] = []
    if (data.response) {
      const hashtagMatches = data.response.match(/#\w+/g)
      if (hashtagMatches) {
        hashtags = hashtagMatches.slice(0, 12)
      }
    }

    // Fallbacks if no hashtags detected
    if (hashtags.length === 0) {
      const words = keywords.split(' ').filter((w: string) => w.length > 2)
      hashtags = words.map((w: string) => `#${w.toLowerCase()}`)
      if (hashtags.length === 0) {
        hashtags = [`#${keywords.toLowerCase().replace(/\s+/g, '')}`, '#social', '#content']
      }
    }

    return NextResponse.json({
      hashtags,
      copyText: hashtags.join(' '),
    })
  } catch (error) {
    console.error('Hashtag Suggester API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 500 }
    )
  }
}
