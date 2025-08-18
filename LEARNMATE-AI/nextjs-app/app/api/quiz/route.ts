export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // stored in .env.local
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const prompt = `Create a quiz from the following text. Generate 4-6 multiple choice questions in JSON format with the following structure:
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Make questions challenging but fair, with plausible distractors for incorrect options.

Text: ${text}`;

    // Call Together AI
    const response = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3", // good model for text tasks
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawOutput = response.choices[0]?.message?.content || "";

    try {
      // Try to extract JSON from model output
      const quizMatch = rawOutput.match(/\{[\s\S]*\}/);
      if (quizMatch) {
        const quizData = JSON.parse(quizMatch[0]);
        return NextResponse.json(quizData);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    // Fallback: at least return one question
    return NextResponse.json({
      quiz: [
        {
          question: "What is the main topic of the provided text?",
          options: ["Topic A", "Topic B", "Topic C", "Topic D"],
          correct: 0,
          explanation: rawOutput || "Generated from your text",
        },
      ],
    });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
