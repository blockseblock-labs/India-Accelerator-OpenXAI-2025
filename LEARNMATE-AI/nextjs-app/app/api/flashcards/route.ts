import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();
  const flashcards = [
    { front: 'Q1 from notes', back: 'Answer 1' },
    { front: 'Q2 from notes', back: 'Answer 2' }
  ];
  return NextResponse.json({ flashcards });
}
