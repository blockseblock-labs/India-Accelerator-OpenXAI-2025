import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, character } = await req.json()

    const characterPrompts = {
      wizard: "You are a wise wizard in a fantasy game. Respond in character with magical wisdom.",
      warrior: "You are a brave warrior in a fantasy game. Respond with courage and strength.",
      rogue: "You are a sneaky rogue in a fantasy game. Respond with wit and cunning.",
      default: "You are a helpful game character. Respond in a friendly, game-like manner."
    }

    const characterPrompt = characterPrompts[character as keyof typeof characterPrompts] || characterPrompts.default

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tinyllama:latest',
        prompt: `${characterPrompt}\n\nPlayer says: "${message}"\n\nRespond as the character:`,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      message: data.response || 'The character remains silent...',
      character: character || 'unknown'
    })
  } catch (error) {
    console.error('Character chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process character chat' },
      { status: 500 }
    )
  }
} 