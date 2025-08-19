import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const last = messages[messages.length-1]?.content || '';
  return NextResponse.json({ reply: `You asked: "${last}". Here's a helpful explanation.` });
}
