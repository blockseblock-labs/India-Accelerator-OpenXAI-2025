import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a friendly study buddy. Give helpful, clear, and simple explanations."
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return NextResponse.json({ answer });
}
