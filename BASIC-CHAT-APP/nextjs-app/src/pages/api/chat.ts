import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatResponse } from '@/types/chat'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'Only POST requests are allowed' })
  }

  try {
    const { message } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid message', error: 'Message is required and must be a string' })
    }

    // For now, we'll simulate the Llama3 response
    // In a real implementation, you would integrate with Ollama or another Llama3 service
    const response = await simulateLlama3Response(message)

    res.status(200).json({ message: response })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      message: 'Sorry, I encountered an error processing your request.',
      error: 'Internal server error'
    })
  }
}

// Simulate Llama3 response - replace this with actual Llama3 integration
async function simulateLlama3Response(userMessage: string): Promise<string> {
  // Add a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

  // Simple response generation based on user input
  const responses = {
    greeting: [
      "Hello! I'm Llama3, your AI assistant. How can I help you today?",
      "Hi there! I'm here to help with any questions or tasks you might have.",
      "Greetings! What would you like to know or discuss?"
    ],
    question: [
      "That's an interesting question! Let me think about that...",
      "Based on my knowledge, I can help you with that.",
      "I'd be happy to help you understand this topic better."
    ],
    code: [
      "I can help you with coding! What programming language or concept are you working with?",
      "Let me assist you with that code. What specifically would you like help with?",
      "Programming questions are my specialty! What can I help you build or debug?"
    ],
    default: [
      "I understand what you're asking. Let me provide you with a helpful response.",
      "That's a great point. Here's what I think about that...",
      "I'm processing your message. Let me give you a thoughtful response.",
      "Thank you for your message. I'm here to help with whatever you need."
    ]
  }

  const lowerMessage = userMessage.toLowerCase()
  
  let responseCategory = 'default'
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    responseCategory = 'greeting'
  } else if (lowerMessage.includes('?') || lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why')) {
    responseCategory = 'question'
  } else if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('function') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('react')) {
    responseCategory = 'code'
  }

  const categoryResponses = responses[responseCategory as keyof typeof responses]
  const baseResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)]

  // Add some context-aware follow-up
  const followUps = [
    "\n\nIs there anything specific you'd like me to elaborate on?",
    "\n\nWould you like me to explain this in more detail?",
    "\n\nFeel free to ask any follow-up questions!",
    "\n\nWhat else would you like to know about this topic?"
  ]

  if (Math.random() > 0.3) {
    return baseResponse + followUps[Math.floor(Math.random() * followUps.length)]
  }

  return baseResponse
}
