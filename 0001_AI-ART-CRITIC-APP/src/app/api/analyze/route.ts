import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const response = await ollama.chat({
      model: "llava:latest",
      messages: [
        {
          role: "user",
          content: `You are an AI art critic. Look at this image and identify its artistic style.
          
Please respond ONLY in this format:
Art Style: [e.g., Impressionism, Cubism, Pop Art, etc.]
Analysis: [A brief analysis of the image's characteristics that led to your conclusion.]`,
          images: [base64Image]
        }
      ]
    });

    const result = response.message.content?.trim();
    
    let style = "Unknown";
    let analysis = "No analysis available.";
    
    if (result) {
      const styleMatch = result.match(/Art Style:\s*(.+)/i);
      if (styleMatch) {
        style = styleMatch[1].trim();
      }
      
      const analysisMatch = result.match(/Analysis:\s*(.+)/i);
      if (analysisMatch) {
        analysis = analysisMatch[1].trim();
      }
    }

    return NextResponse.json({ 
      style,
      analysis,
      fullResponse: result,
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