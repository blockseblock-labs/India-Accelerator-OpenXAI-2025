import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Request body:', body)
    
    // Handle different possible formats
    let message = '';
    
    if (body.message) {
      // Simple message format
      message = body.message;
    } else if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
      // Chat messages format - get the last user message
      const lastMessage = body.messages[body.messages.length - 1];
      message = lastMessage.content || lastMessage.message;
    } else if (body.prompt) {
      message = body.prompt;
    }
    
    console.log('Extracted message:', message)
    
    if (!message) {
      return NextResponse.json(
        { error: 'No message provided in request' },
        { status: 400 }
      )
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tinyllama:latest',
        prompt: message,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama error:', errorText)
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Full Ollama response:', JSON.stringify(data, null, 2))
    
    // Also log to the response for debugging
    console.log('Response keys:', Object.keys(data))
    console.log('Response values:', Object.values(data))
    
    // Handle different possible response formats
    let modelResponse = '';
    if (data.response) {
      modelResponse = data.response;
    } else if (data.message) {
      modelResponse = data.message;
    } else if (data.text) {
      modelResponse = data.text;
    } else if (data.content) {
      modelResponse = data.content;
    } else {
      console.log('Unexpected response format:', data);
      modelResponse = 'Model responded but in unexpected format';
    }
    
    return NextResponse.json({ 
      message: modelResponse || 'Empty response from model'
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}