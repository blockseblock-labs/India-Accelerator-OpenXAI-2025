import { NextResponse } from "next/server";

/**
 * Call Ollama with llama3:latest
 */
async function callModel(prompt: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3:latest",
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Model API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.response) {
    console.error("Unexpected model response:", data);
    throw new Error("Model did not return a response");
  }

  return data.response.trim();
}

/**
 * Validate and parse the model's output
 */
function validateResponse(raw: string) {
  try {
    const parsed = JSON.parse(raw);

    if (
      typeof parsed.impact !== "string" ||
      !["low", "medium", "high"].includes(parsed.severity) ||
      typeof parsed.co2_increase !== "number" ||
      typeof parsed.temperature_rise !== "number"
    ) {
      throw new Error("Invalid schema");
    }

    return parsed;
  } catch (err) {
    console.error("❌ Invalid model response:", raw);
    throw new Error("Invalid model response format");
  }
}

/**
 * Next.js POST handler
 */
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
You are an environmental AI expert analyzing the impact of human actions on Earth.  
ONLY return a valid JSON object with the following keys:  
impact (string), severity ("low" | "medium" | "high"), co2_increase (number), temperature_rise (number).  

Example:
{
  "impact": "Deforestation reduces biodiversity and increases carbon emissions.",
  "severity": "high",
  "co2_increase": 2.5,
  "temperature_rise": 0.03
}

Now analyze this text: "${text}".
⚠️ IMPORTANT: Output ONLY the JSON object, no extra text, no markdown.
`;

    const raw = await callModel(prompt);
    console.log("📩 Raw model output:", raw);

    const validated = validateResponse(raw);

    return NextResponse.json(validated);
  } catch (err: any) {
    console.error("🚨 Error in /api/process-command:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
