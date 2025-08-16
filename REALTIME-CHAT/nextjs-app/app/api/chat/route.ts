import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const prompt = lastMessage?.content || ''

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3', // ✅ Changed from llama2 to llama3
        prompt: prompt,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              try {
                const data = JSON.parse(line)
                if (data.response) {
                  controller.enqueue(new TextEncoder().encode(data.response))
                }
                if (data.done) {
                  controller.close()
                  return
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          reader.releaseLock()
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}