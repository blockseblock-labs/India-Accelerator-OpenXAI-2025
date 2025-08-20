// In app/api/chat/route.ts

import { NextRequest } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response('Invalid request: No user message found', { status: 400 });
    }

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma:2b', // Using the smaller, compatible model
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return new Response(`Error from Ollama: ${errorText}`, { status: response.status });
    }

    // Return the streaming response directly to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });

  } catch (error) {
    console.error('An error occurred in the chat API route:', error);
    return new Response(`Internal Server Error. Is Ollama running?`, { status: 500 });
  }
}