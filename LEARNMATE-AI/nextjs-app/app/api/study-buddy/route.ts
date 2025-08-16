import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    if (!notes || typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Notes (string) are required' },
        { status: 400 }
      );
    }

    const prompt = `Create flashcards from the following notes. Generate 5-8 flashcards in JSON format with the following structure:
{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Focus on key concepts, definitions, and important facts. Make questions clear and answers concise.

Notes: ${notes}`;

    // Call Ollama API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable streaming so we can parse the full output
      body: JSON.stringify({
        model: 'mistral:latest',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `Ollama API returned status ${response.status}: ${errText}`
      );
    }

    const data = await response.json();

    // Validate response shape
    if (!data?.response || typeof data.response !== 'string') {
      throw new Error('Ollama response missing expected "response" field');
    }

    // Try extracting JSON from the model's output
    let flashcardsData;
    try {
      const match = data.response.match(/\{[\s\S]*\}/);
      if (match) {
        flashcardsData = JSON.parse(match[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON from model output:', parseError);
    }

    // If parsed JSON exists, return it
    if (flashcardsData) {
      return NextResponse.json(flashcardsData, { status: 200 });
    }

    // Fallback: return plain text as a single flashcard
    return NextResponse.json(
      {
        flashcards: [
          {
            front: 'Generated from your notes',
            back: data.response.trim(),
          },
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Failed to generate flashcards. Ensure Ollama is running and mistral:latest is installed.',
      },
      { status: 500 }
    );
  }
}
