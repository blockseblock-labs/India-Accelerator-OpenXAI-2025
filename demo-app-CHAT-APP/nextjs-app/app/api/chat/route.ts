import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const ollamaRes = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3:latest',
      prompt: message,
      stream: true,
    }),
  })

  if (!ollamaRes.ok) {
    return NextResponse.json({ error: 'Failed to call Ollama' }, { status: 500 })
  }

  const encoder = new TextEncoder()

  // Create a readable stream that forwards only chunk.response
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          break
        }

        const json = JSON.parse(decoder.decode(value))
        const text = json.response || ''
        controller.enqueue(encoder.encode(text))
      }
    },
  })

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain' },
  })
}


