import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();
    if (!notes) {
      return NextResponse.json({ error: "Notes are required" }, { status: 400 });
    }

    const prompt = `Create flashcards from the following notes. Generate 5-8 flashcards in JSON format with this structure:
{
  "flashcards": [
    { "front": "Question or term", "back": "Answer or definition" }
  ]
}
Focus on key concepts, definitions, and important facts. Make questions clear and answers concise.

Notes: ${notes}`;

    const resp = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a helpful assistant that always responds with valid JSON flashcards." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = resp.choices[0].message?.content || "";

    try {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return NextResponse.json(JSON.parse(m[0]));
    } catch {}

    return NextResponse.json({ flashcards: [{ front: "Generated", back: content }] });
  } catch (e) {
    console.error("Flashcards API error:", e);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
