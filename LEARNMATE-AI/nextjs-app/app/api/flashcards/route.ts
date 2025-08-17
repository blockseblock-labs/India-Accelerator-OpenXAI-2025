// app/api/flashcards/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Temporary: just echo back for testing
    return NextResponse.json({
      received: text,
      message: "POST works ✅",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: String(error) },
      { status: 500 }
    );
  }
}
