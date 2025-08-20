import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
+    const { message } = body;

    
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest ", 

        messages: [{ role: "user", content: message }],
        stream: false // stream = false → wait for full response
      }),
    });
+
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Ollama returns something like { message: { content: "..." } }
    const reply = data.message?.content || "No response from model";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}