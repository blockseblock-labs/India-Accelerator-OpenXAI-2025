import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Use Ollama to analyze the image
    const response = await ollama.chat({
      model: "llava:latest", // Using LLaVA for image analysis
      messages: [
        {
          role: "user",
          content: `Look at this image and tell me:
1. What do you see? (person, animal, object, scene, etc.)
2. Is it HOT or NOT?

Please respond in this format:
Description: [brief description of what you see]
Verdict: [HOT or NOT]`,
          images: [base64Image]
        }
      ]
    });

    const result = response.message.content?.trim();
    
    // Parse the response to extract description and verdict
    let description = "Unknown";
    let verdict = "NOT";
    
    if (result) {
      // Extract description
      const descMatch = result.match(/Description:\s*(.+?)(?:\n|$)/i);
      if (descMatch) {
        description = descMatch[1].trim();
      }
      
      // Extract verdict
      const verdictMatch = result.match(/Verdict:\s*(HOT|NOT)/i);
      if (verdictMatch) {
        verdict = verdictMatch[1].toUpperCase();
      } else if (result.toUpperCase().includes("HOT")) {
        verdict = "HOT";
      }
    }

    return NextResponse.json({ 
      verdict,
      description,
      fullResponse: result,
      filename: file.name 
    });

  } catch (error: unknown) {
    console.error("Error analyzing image:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze image";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 