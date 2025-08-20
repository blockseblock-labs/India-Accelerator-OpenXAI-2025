import { NextRequest } from "next/server";
import ollama from "ollama";

const model = "llama3";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      start: async (controller) => {
        try {
          const iter = await ollama.chat({
            model,
            messages: [{ role: "user", content: data.message }],
            stream: true,
          });

          for await (const part of iter) {
            const token = part.message?.content ?? "";
            if (token) controller.enqueue(encoder.encode(token));
          }
        } catch (err) {
          controller.error(err);
          return;
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Streaming error";
    return new Response(message, { status: 500 });
  }
}
