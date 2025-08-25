import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await generateObject({
    model: google("gemini-2.0-flash-exp"),
    system:
      "Analyze the following journal entry and provide a brief, empathetic sentiment analysis in 2-3 sentences.",
    prompt,
    schema: z.object({
      sentiements: z.string(),
    }),
  });

  return result.toJsonResponse();
}
