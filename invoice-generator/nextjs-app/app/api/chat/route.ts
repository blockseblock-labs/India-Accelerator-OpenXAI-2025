import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const ollamaPrompt = `You are an invoice generator. 
Extract any invoice details (like amount and client name) from the following text and generate a professional invoice template using the format below. 
If any detail is missing, leave that section blank (for the user to fill in later) using a line of underscores '______'. 
Do not ask for more information or provide any extra commentary.

Text: ${prompt}

Format:
-----------------------------
INVOICE
-----------------------------
Client Name: <client or ______>
Amount Due: <amount or ______>
Due Date: ______
Services Provided: ______
Payment Method: ______
-----------------------------
Thank you for your business!`;

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: ollamaPrompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      throw new Error(`Ollama API error: ${await ollamaRes.text()}`);
    }

    const data = await ollamaRes.json();
    const output = (data.response || "⚠️ No invoice generated. Try again.").trim();

    // Refusal detection phrases
    const refusalPhrases = [
      "can't provide information or guidance on illegal",
      "i cannot assist with",
      "i am not able to help with",
    ];

    const isRefusal = refusalPhrases.some(phrase =>
      output.toLowerCase().includes(phrase)
    );

    if (isRefusal) {
      return NextResponse.json({
        error: "The model refused to generate content for this prompt. Please adjust your input."
      }, { status: 400 });
    }

    return NextResponse.json({ response: output });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      {
        error:
          "Failed to process request. Ensure Ollama is running with 'ollama serve'.",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
