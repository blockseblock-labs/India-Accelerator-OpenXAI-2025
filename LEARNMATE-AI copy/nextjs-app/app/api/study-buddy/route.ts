import { NextRequest, NextResponse } from "next/server";

let sessionContext: { question: string; answer: string; mode: string }[] = [];

const modeInstructions: Record<string, string> = {
  normal: "Answer clearly and concisely at a normal technical depth.",
  eli5: "Explain this as if I am 5 years old. Use simple words and short sentences.",
  dive: "Give a deep, detailed, technical explanation. Assume the reader wants expert-level depth.",
};

export async function POST(req: NextRequest) {
  try {
    const { question, mode = "normal" } = await req.json();

    const instruction = modeInstructions[mode.toLowerCase()] || modeInstructions.normal;

    const body = {
      model: "llama3:latest",
      prompt: `${instruction}\n\nQuestion: ${question}`,
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

    sessionContext.push({ question, answer: data.response, mode });

    return NextResponse.json({ 
      answer: data.response, 
      mode, 
      context: sessionContext 
    });
  } catch (err: any) {
    console.error("Study buddy route error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
