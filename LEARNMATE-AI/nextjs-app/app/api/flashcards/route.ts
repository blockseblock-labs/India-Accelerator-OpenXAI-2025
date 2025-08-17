export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt || "Create 5 flashcards about JavaScript basics",
        stream: false, // easier for debugging
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    console.error("Flashcards API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
