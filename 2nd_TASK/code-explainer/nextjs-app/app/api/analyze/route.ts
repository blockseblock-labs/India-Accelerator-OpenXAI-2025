// app/api/analyze/route.ts
import { NextRequest } from "next/server";
import { runOllama } from "@/lib/ollama";
import { codeCommentPrompt, codeExplainPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { code, mode } = await req.json();

    if (!code || !mode) {
      return new Response(JSON.stringify({ error: "Missing code or mode" }), { status: 400 });
    }

    const prompt = mode === "comment"
      ? codeCommentPrompt(code)
      : codeExplainPrompt(code);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of runOllama(prompt)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500 });
  }
}
