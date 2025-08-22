import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    // Call your local Ollama model
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt: message,
        stream: false,
      }),
    });

    const data = await res.json();
    return NextResponse.json({ reply: data.response });
  } catch (err) {
    console.error("Ollama error:", err);
    return NextResponse.json({ reply: "⚠️ Pet is sleeping... (Ollama not responding)" });
  }
}
