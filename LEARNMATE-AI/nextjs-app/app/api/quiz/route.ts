import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();
  const quiz = [
    { question: 'Sample Q1?', choices: ['A','B','C'], answerIndex: 1, explanation: 'Because B is correct.' }
  ];
  return NextResponse.json({ quiz });
}
