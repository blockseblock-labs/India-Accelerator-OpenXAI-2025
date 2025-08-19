import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("Attempting to connect to Ollama with prompt:", prompt);
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `Create flashcards in JSON format for the following topic: ${prompt}. 
                Format the response as an array of objects with "front" and "back" properties.`,
        stream: false
      }),
    });

    if (!response.ok) {
      console.error("Ollama response not OK:", response.status);
      return NextResponse.json({ error: "Ollama request failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ 
      response: data.response,
      status: 200 
    });
  } catch (error) {
    console.error("Error connecting to Ollama:", error);
    return NextResponse.json({ error: "Failed to connect to Ollama" }, { status: 500 });
  }
}