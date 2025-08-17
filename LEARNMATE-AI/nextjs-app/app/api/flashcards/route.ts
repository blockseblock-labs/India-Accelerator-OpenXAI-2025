import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ✅ needed to reach localhost:11434

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json().catch(() => ({}));
    if (!notes || typeof notes !== 'string' || !notes.trim()) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }

    const prompt = `Create flashcards from the following notes. Generate 5–8 flashcards in JSON with:
{
  "flashcards": [
    { "front": "Question or term", "back": "Answer or definition" }
  ]
}
Keep questions clear and answers concise.
Notes: ${notes}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000); // 60s safety timeout

    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt,
        stream: false, // single JSON object
      }),
      signal: controller.signal,
    }).catch((e) => {
      // Network-level error before we even get a response
      throw new Error(`Network to Ollama failed: ${e.message}`);
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>');
      console.error('🔥 Ollama returned error:', res.status, errText);
      return NextResponse.json(
        { error: `Ollama error ${res.status}: ${errText}` },
        { status: 502 } // Bad gateway from our service to upstream
      );
    }

    const data = await res.json(); // { response: "...", done: true }
    // Try to extract JSON block from model output if it wrapped it in prose
    if (typeof data.response === 'string') {
      const match = data.response.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (parsed && Array.isArray(parsed.flashcards)) {
            return NextResponse.json(parsed, { status: 200 });
          }
        } catch {}
      }
      // Fallback: wrap raw text as one flashcard
      return NextResponse.json({
        flashcards: [{ front: 'From your notes', back: data.response.trim() }],
      });
    }

    // If structure is unexpected
    return NextResponse.json(
      { error: 'Unexpected Ollama response shape', raw: data },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('Flashcards API error:', err);
    const message =
      err?.name === 'AbortError'
        ? 'Timed out talking to Ollama'
        : err?.message || 'Failed to generate flashcards';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}