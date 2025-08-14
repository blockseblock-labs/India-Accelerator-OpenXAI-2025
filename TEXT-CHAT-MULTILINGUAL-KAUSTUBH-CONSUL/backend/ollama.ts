import axios from "axios";

/**
 * Translate text using local Ollama model phi3:latest
 */
export async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  try {
    const response = await axios.post(
      "http://localhost:11434/v1/chat/completions",
      {
        model: "mistral:7b", // NEW model name
        messages: [
          {
            role: "system",
            content:
              "You are a translation engine. Respond ONLY with the translated text. " +
              "Do not explain, comment, or add extra words."
          },
          {
            role: "user",
            content: `Translate from ${from} to ${to}: ${text}`
          }
        ],
        temperature: 0
      }
    );

    let translation = "";
    if (response.data?.choices?.length > 0) {
      translation = response.data.choices[0].message.content.trim();
    }

    // Post-process: keep only first line
    if (translation.includes("\n")) {
      translation = translation.split("\n")[0].trim();
    }

    return translation || "Translation failed";
  } catch (error) {
    console.error("Translation error:", error);
    return "ERROR: Translation failed!";
  }
}
