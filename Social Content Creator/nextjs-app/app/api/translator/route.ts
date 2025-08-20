import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await req.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "'text' and 'targetLang' are required" },
        { status: 400 }
      )
    }

    const prompt = `You are a precise translator. Preserve meaning, tone, and emojis.
Translate the following text${sourceLang ? ` from ${sourceLang}` : ''} to ${targetLang} only:

"${text}"`

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
    const translated = data.response?.trim() || ''

    return NextResponse.json({ translated })
  } catch (error) {
    console.error('Translator API error:', error)
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    )
  }
}
