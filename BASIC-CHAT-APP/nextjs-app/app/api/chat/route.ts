// app/api/chat/route.ts
export const runtime = 'nodejs'; // ensure Node runtime

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3';

    const upstream = await fetch(`${host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Non-streaming to keep it simple & robust
      body: JSON.stringify({
        model,
        messages,     // [{ role: 'user'|'assistant', content: string }]
        stream: false,
        options: { temperature: 0.7 }
      })
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: text }), { status: 502 });
    }

    const data = await upstream.json(); // { message: { role, content }, ... }
    return Response.json(data);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
