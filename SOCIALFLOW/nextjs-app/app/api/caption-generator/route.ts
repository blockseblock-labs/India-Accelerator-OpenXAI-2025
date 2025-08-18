import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: `Generate a short, catchy caption for this image. (Note: image is base64, only describe it in general terms).`
      }),
    })

    const text = await ollamaResponse.text()
    console.log('📢 Ollama raw response:', text)

    if (!ollamaResponse.ok) {
      return NextResponse.json({ error: 'Ollama request failed', details: text }, { status: 500 })
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { response: text } // fallback if Ollama streams plain text
    }

    return NextResponse.json({ caption: parsed.response || parsed })
  } catch (error) {
    console.error('🔥 API route crashed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
