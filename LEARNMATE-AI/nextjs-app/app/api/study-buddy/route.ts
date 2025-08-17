import { NextRequest, NextResponse } from "next/server";

let sessionContext: { question: string; answer: string }[] = [];

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const body = {
      model: "llama3:latest",
      prompt: question,
      stream: false,
    };

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Ollama API failed", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Save Q&A in context
    sessionContext.push({ question, answer: data.response });

    return NextResponse.json({ answer: data.response, context: sessionContext });
  } catch (err: any) {
    console.error("Study buddy route error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
