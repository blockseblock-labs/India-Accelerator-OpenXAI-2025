// app/api/process-command/route.ts

export async function POST(req: Request) {
  try {
    // Get the command from request body
    const { command } = await req.json();

    // Send request to Ollama API (make sure Ollama is running locally)
    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",   // Ensure this model is pulled with: ollama pull llama3
        prompt: command,
        stream: false,     // set to true if you want streaming later
      }),
    });

    // Handle errors from Ollama
    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text();
      throw new Error(`Ollama request failed: ${errText}`);
    }

    // Parse response JSON
    const data = await ollamaResponse.json();

    // Return response back to client
    return new Response(
      JSON.stringify({ response: data.response }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing command:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
