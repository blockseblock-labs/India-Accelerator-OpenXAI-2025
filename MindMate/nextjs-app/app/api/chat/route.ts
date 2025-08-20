import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual Ollama API call
    // For now, we'll simulate the AI response
    const aiResponse = await generateAIResponse(message)

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateAIResponse(userMessage: string): Promise<string> {
  // This is a placeholder function - replace with actual Ollama API call
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Context-aware responses based on user input
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    return "I can sense you're feeling stressed or anxious. That's completely normal, and it's okay to feel this way. Let's take a moment together - try taking 3 deep breaths: inhale for 4 counts, hold for 4, exhale for 6. How does that feel? What's been causing you stress lately?"
  }
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
    return "I hear that you're feeling sad, and I want you to know that your feelings are completely valid. It's okay to not be okay sometimes. What would help you feel a little better right now? Maybe we could talk about what's been on your mind, or I could suggest some gentle activities that might help lift your spirits."
  }
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('excited') || lowerMessage.includes('good')) {
    return "That's wonderful! I'm so glad you're feeling positive right now. What's contributing to this good mood? Sometimes sharing our joy can multiply it. Consider reaching out to someone you care about to share this positive energy - it might brighten their day too!"
  }
  
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleep')) {
    return "It sounds like you're feeling tired, and that's your body's way of telling you it needs rest. Have you been getting enough sleep lately? Sometimes even a short 10-minute break can make a big difference. What would help you feel more rested right now?"
  }
  
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
    return "I can feel the frustration in your message, and that's completely understandable. Anger is a natural emotion that often signals that something important to us has been affected. What's been happening that's made you feel this way? Sometimes talking it out can help us process these feelings."
  }
  
  if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
    return "Feeling lonely can be really difficult, and I want you to know that you're not alone in feeling this way. Many people experience loneliness, especially during challenging times. What kind of connection are you looking for right now? Sometimes even small interactions can help us feel more connected to the world around us."
  }
  
  // Default empathetic response
  const responses = [
    "Thank you for sharing that with me. I'm here to listen and support you. What's been on your mind lately?",
    "I appreciate you opening up to me. It takes courage to be vulnerable. How can I best support you right now?",
    "I hear you, and I want you to know that your feelings matter. What would help you feel better today?",
    "Thank you for trusting me with your thoughts. Everyone's journey is unique, and I'm here to walk alongside you. What's been the most challenging part of your day?",
    "I understand that you're going through something, and I want you to know that you don't have to face it alone. What's one small thing that might help you feel a bit better today?"
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// TODO: Implement actual Ollama integration
async function callOllamaAPI(message: string): Promise<string> {
  try {
    // Example Ollama API call (adjust based on your setup)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral', // or 'llama2', 'gemma'
        prompt: `You are MindMate, an empathetic AI mental wellness companion. A user has shared: "${message}". Respond with empathy, understanding, and helpful suggestions. Keep responses conversational and supportive, around 2-3 sentences.`,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || 'I understand how you\'re feeling. Would you like to talk more about it?'
    
  } catch (error) {
    console.error('Ollama API error:', error)
    // Fallback to simulated response
    return generateAIResponse(message)
  }
}
