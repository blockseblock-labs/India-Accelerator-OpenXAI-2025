import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    if (!notes) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    console.log('OpenRouter API Key:', openRouterApiKey);
    if (!openRouterApiKey) {
      throw new Error('Missing OpenRouter API Key');
    }

    const prompt = `Create 5-8 flashcards in pure JSON only, with no extra commentary. 
    Output should match this format exactly:

    {
      "flashcards": [
        { "front": "...", "back": "..." },
        ...
      ]
    }

    Flashcards should cover these notes:
    ${notes}
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'http://localhost:3000',   
        'X-Title': 'LearnMate AI',                
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', response.status, errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    const togetherResponse = data.choices?.[0]?.message?.content || '';

    try {
      const flashcardsMatch = togetherResponse.match(/\{[\s\S]*\}/);
      if (flashcardsMatch) {
        const flashcardsData = JSON.parse(flashcardsMatch);
        return NextResponse.json(flashcardsData);
      }
    } catch {
      console.log('Could not parse JSON, returning plain response');
    }

    return NextResponse.json({
      flashcards: [
        { front: 'Generated from your notes', back: togetherResponse || 'No response' },
      ],
    });

  } catch (error) {
    console.error('Flashcards API error:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
