import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
  const { answers, questions }: { answers: string[]; questions?: string[] } =
    await req.json();

  const paired = answers
    .map(
      (a, i) => `Q${i + 1}: ${questions?.[i] ?? "(question)"}\nA${i + 1}: ${a}`
    )
    .join("\n\n");

  const prompt = `You are a supportive mental health assistant. Given the user's self-check responses, provide empathetic, practical insights.

    User Responses:
    
    ${paired}`;

  const result = await generateObject({
    model: google("gemini-2.0-flash-exp"),
    system:
      "Analyze the user's mental health check responses. Be concise, warm, and actionable. Avoid diagnosis; focus on encouragement and next steps.",
    prompt,
    schema: z.object({
      summary: z
        .string()
        .describe(
          "2-4 sentence empathetic summary tailored to the user's answers."
        ),
      moodScore: z
        .number()
        .min(0)
        .max(100)
        .describe("Overall wellbeing score from 0 (low) to 100 (high)."),
      riskLevel: z
        .enum(["low", "moderate", "high"])
        .describe("Relative concern level based on responses."),
      suggestions: z
        .array(z.string())
        .min(0)
        .max(100)
        .describe("Short, concrete next steps the user can try this week."),
    }),
  });

  return result.toJsonResponse();
}
