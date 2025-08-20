import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { text, notes } = body || {};
    const input = (notes ?? text ?? '').trim();

    if (!input) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `Create a quiz from the following text. Generate 4-6 multiple choice questions in JSON format with the following structure:
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Make questions challenging but fair, with plausible distractors for incorrect options.

Text: ${input}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: 'Failed to get response from Ollama', details: errText },
        { status: 500 }
      );
    }

    const data = await response.json();

    try {
      const raw = String(data?.response ?? '');

      // Extract the JSON object between the first '{' and the last '}'
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const jsonStr = raw.slice(start, end + 1);
        const quizData = JSON.parse(jsonStr);
        return NextResponse.json(quizData);
      }
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
    }

    // Fallback if parsing fails
    return NextResponse.json({
      quiz: [
        {
          question: 'What is the main topic of the provided text?',
          options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
          correct: 0,
          explanation: data?.response || 'Generated from your text',
        },
      ],
    });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
