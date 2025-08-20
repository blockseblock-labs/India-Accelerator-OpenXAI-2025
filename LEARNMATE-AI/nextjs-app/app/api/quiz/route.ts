import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

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
          content: "You are a quiz generator. Create multiple-choice questions with 4 options, a correct index, and an explanation. Return JSON array."
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  let quiz = [];

  try {
    quiz = JSON.parse(data.choices[0].message.content);
  } catch {
    quiz = [];
  }

  return NextResponse.json({ quiz });
}
