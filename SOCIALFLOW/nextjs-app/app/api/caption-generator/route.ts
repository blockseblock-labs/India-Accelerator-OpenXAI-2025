import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageDescription, count } = await req.json()

    if (!imageDescription) {
      return NextResponse.json(
        { error: 'Image description is required' },
        { status: 400 }
      )
    }

    const numCaptions = Math.min(3, Math.max(2, Number(count) || 3))

    const prompt = `You are a world-class social copywriter. Craft ${numCaptions} premium Instagram captions for this image description: "${imageDescription}".

Requirements for EACH caption:
- One sentence, punchy and memorable
- Use tasteful emojis (1–3) that enhance the vibe
- Avoid clichés like "unforgettable", "amazing", "breathtaking"
- Vary tone across captions (e.g., playful, poetic, confident)
- No hashtags, no quotes, no extra commentary

Output STRICTLY a JSON array of ${numCaptions} strings. No markdown, no labels. Example: ["caption 1", "caption 2"].`

    const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434'
    const MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b'

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.85,
          top_p: 0.9,
          repeat_penalty: 1.1
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error('Ollama error:', response.status, errorText)
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()

    let captions: string[] = []
    const raw = (data.response || '').trim()
    
    // Try parse as JSON array
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        captions = parsed
          .filter((v: unknown) => typeof v === 'string')
          .map((s: string) => s.trim())
          .filter(Boolean)
      }
    } catch {
      // Extract JSON array substring if model wrapped text
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          if (Array.isArray(parsed)) {
            captions = parsed
              .filter((v: unknown) => typeof v === 'string')
              .map((s: string) => s.trim())
              .filter(Boolean)
          }
        } catch {
          // fallthrough
        }
      }
    }

    // Fallback: split lines
    if (captions.length === 0 && raw) {
      captions = raw
        .split(/\r?\n+/)
        .map((line: string) => line.replace(/^[-*\d.\s#]+/, '').trim())
        .filter(Boolean)
        .slice(0, numCaptions)
    }

    // Final safety: ensure at least one caption
    if (captions.length === 0) {
      captions = ['Unable to generate captions']
    }

    return NextResponse.json({ 
      captions,
      count: captions.length,
      copyText: captions.join('\n')
    })
  } catch (error) {
    console.error('Caption Generator API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    )
  }
} 