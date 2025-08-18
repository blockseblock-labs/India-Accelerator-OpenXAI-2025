import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = (body?.messages ?? []) as Array<{ role: 'user' | 'assistant'; content: string }>

    // Build a simple prompt from the conversation
    const prompt = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n') + '\nAssistant:'

    const upstream = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        messages: [
          { role: 'system', content: 'You are a helpful, concise assistant. Avoid repeating words or phrases.' },
          ...messages,
        ],
        options: {
          temperature: 0.7,
          top_p: 0.9,
          repeat_penalty: 1.2,
        },
        keep_alive: '5m',
        stream: true,
      }),
    })

    if (!upstream.ok || !upstream.body) {
      throw new Error('Failed to get response from Ollama')
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = upstream.body!.getReader()
        let buffer = ''
        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break
            if (value) {
              buffer += decoder.decode(value, { stream: true })
              let newlineIndex = buffer.indexOf('\n')
              while (newlineIndex !== -1) {
                const line = buffer.slice(0, newlineIndex).trim()
                buffer = buffer.slice(newlineIndex + 1)
                if (line) {
                  try {
                    const json = JSON.parse(line)
                    const text: string | undefined = json?.message?.content ?? json?.response
                    if (text) controller.enqueue(encoder.encode(text))
                  } catch {
                    // Ignore malformed line
                  }
                }
                newlineIndex = buffer.indexOf('\n')
              }
            }
          }
          // Flush any trailing JSON line (best-effort)
          const last = buffer.trim()
          if (last) {
            try {
              const json = JSON.parse(last)
              const text: string | undefined = json?.message?.content ?? json?.response
              if (text) controller.enqueue(encoder.encode(text))
            } catch {}
          }
        } catch (err) {
          controller.error(err)
          return
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Failed to process chat message', { status: 500 })
  }
}