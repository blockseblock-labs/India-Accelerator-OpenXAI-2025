import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

const model = "llama3";

export async function POST(request: NextRequest) {
  try {

    const data = await request.json();
    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: data.message }],
    });
    return NextResponse.json({ message: response.message.content });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? JSON.stringify(error) },
      { status: 500 }
    );
  }
}
