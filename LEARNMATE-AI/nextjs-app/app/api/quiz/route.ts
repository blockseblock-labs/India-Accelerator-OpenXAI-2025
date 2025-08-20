import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Ensure this runs on Node.js

export async function POST(req: NextRequest) {
  try {
    // 1. Get and validate the text from the request body
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    // 2. Construct a more reliable prompt
    const prompt = `Create a quiz from the following text. Generate 4-6 multiple-choice questions in JSON format.

Important: Your entire response must be ONLY the raw JSON object, without any introductory text, comments, or markdown formatting like \`\`\`json. Do not use trailing commas.

The JSON structure must be:
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

Text: """${text}"""`;

    // 3. Call the Ollama API
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🟢 Raw Ollama response:', data.response);

    // 4. Robustly parse the AI's response
    try {
      const rawText = data.response;

      // Find the first '{' and the last '}' to extract the JSON object
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        let jsonString = rawText.substring(jsonStart, jsonEnd + 1);

        // Sanitize the string to remove trailing commas before parsing
        jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
        
        const quizData = JSON.parse(jsonString);
        return NextResponse.json(quizData);
      } else {
        throw new Error('No valid JSON object found in the AI response.');
      }
    } catch (err) {
      console.error('❌ JSON parse failed, returning fallback:', err);
      // Fallback response if parsing fails
      return NextResponse.json({
        quiz: [
          {
            question: 'The AI failed to generate a valid quiz. Please try again.',
            options: ['Try again', 'Try a different topic', 'Check the server', 'OK'],
            correct: 0,
            explanation: `The AI's raw response was: ${data.response || 'No response text.'}`,
          },
        ],
      });
    }
  } catch (error) {
    console.error('🚨 Quiz API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating the quiz.' },
      { status: 500 }
    );
  }
}