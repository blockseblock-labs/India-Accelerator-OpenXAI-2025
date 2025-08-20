import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: message,
        stream: false, // get the full response at once
      }),
    });

    if (!ollamaRes.ok) {
      const error = await ollamaRes.text();
      return NextResponse.json({ reply: error }, { status: 500 });
    }

    const data = await ollamaRes.json();
    return NextResponse.json({ reply: data.response });
  } catch (error: any) {
    return NextResponse.json(
      { reply: error.message ?? JSON.stringify(error) },
      { status: 500 }
    );
  }
}
