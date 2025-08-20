// app/api/process-command/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Call Ollama API (assumes Ollama running locally on port 11434)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b", // Your chosen model
        prompt,
        stream: false, // disable streaming for simplicity
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Ollama’s response format → usually { response: "..." }
    return NextResponse.json({ response: data.response || "No response generated." });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from AI." },
      { status: 500 }
    );
  }
}
