import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // 🔹 Request to Ollama
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b', // must be installed: run `ollama pull llama3.2:1b`
        prompt: `Describe this image briefly (you only see its base64 snippet): ${image.substring(0, 100)}...`
      }),
    })

    const text = await ollamaResponse.text() // <-- IMPORTANT: read raw text
    console.log('📢 Ollama raw response:', text)

    // Try to parse JSON if possible, otherwise return text
    let analysis = text
    try {
      const parsed = JSON.parse(text)
      analysis = parsed.response || text
    } catch {
      // ignore parse error, keep text
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('🔥 Server crashed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
