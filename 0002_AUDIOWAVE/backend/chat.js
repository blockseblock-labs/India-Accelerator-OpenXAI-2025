import fetch from "node-fetch";

/**
 * Send a prompt to Ollama and get back the model's response.
 * @param {string} prompt - User input prompt
 * @returns {Promise<string>} - The model's response
 */
export async function getOllamaResponse(prompt) {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",  // ✅ change if you have a different Ollama model
        prompt,
        stream: true             // ✅ ensures streaming response
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama API error: ${text}`);
    }

    let output = "";

    // Ollama sends a stream of JSON objects, one per line
    const decoder = new TextDecoder();
    for await (const chunk of res.body) {
      const lines = decoder.decode(chunk).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            output += data.response;
          }
        } catch (err) {
          console.warn("⚠️ Failed to parse chunk:", line);
        }
      }
    }

    return output.trim() || "No response from Ollama";
  } catch (err) {
    console.error("❌ Ollama fetch error:", err.message);
    return "Error getting response from Ollama";
  }
}
