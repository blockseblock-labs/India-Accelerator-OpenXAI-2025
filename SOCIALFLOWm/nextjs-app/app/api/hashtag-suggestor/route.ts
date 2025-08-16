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

Format them as a simple list with # symbols, one per line. No explanations or extra text.

Example format:
#keyword
#relatedtag
#trendingtag`

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
    
    // Parse hashtags from response
    let hashtags: string[] = []
    
    if (data.response) {
      // Extract hashtags from the response
      const hashtagMatches = data.response.match(/#\w+/g)
      if (hashtagMatches) {
        hashtags = hashtagMatches.slice(0, 12) // Limit to 12 hashtags
      } else {
        // Fallback: create hashtags from keywords if no hashtags found
        const words = keywords.split(' ').filter((word: string) => word.length > 2)
        hashtags = words.map((word: string) => `#${word.toLowerCase()}`)
      }
    }
    
    // Ensure we have at least some hashtags
    if (hashtags.length === 0) {
      hashtags = [`#${keywords.toLowerCase().replace(/\s+/g, '')}`, '#social', '#content']
    }
    
    return NextResponse.json({ 
      hashtags: hashtags,
      copyText: hashtags.join(' ')
    })
  } catch (error) {
    console.error('Hashtag Suggestor API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 500 }
    )
  }
} 