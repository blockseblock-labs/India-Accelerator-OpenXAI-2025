import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build the prompt with history
    const prompt = `You are a helpful study buddy. Answer clearly and concisely.

Conversation history:
${Array.isArray(history) 
  ? history.map((m: { role: string; content: string }) => `- ${m.role}: ${m.content}`).join("\n") 
  : ""}

User: ${message}

Answer:`;

    // Call Ollama running locally
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get response from Ollama', details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.response?.trim() || "(no reply)";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error('Study Buddy API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate study buddy response', details: error.message },
      { status: 500 }
    );
  }
}
