import { NextRequest, NextResponse } from 'next/server'

// Helper function to generate helpful study advice when Ollama is not available
function generateFallbackStudyAdvice(question: string) {
  const cleanQuestion = question.toLowerCase().trim()
  
  // Analyze the question type and provide relevant advice
  if (cleanQuestion.includes('what') || cleanQuestion.includes('define') || cleanQuestion.includes('meaning')) {
    return {
      answer: `I can see you're asking about definitions or meanings. While I can't provide the specific answer right now, here are some study strategies for understanding new concepts:

1. **Break it down**: Look for root words or familiar parts
2. **Context clues**: Read the surrounding text for hints
3. **Examples**: Find real-world applications
4. **Visual aids**: Draw diagrams or mind maps
5. **Practice**: Use the concept in different contexts

Your question was: "${question}"

To get AI-powered answers, install Ollama from https://ollama.ai and run: ollama pull llama3.2:1b`
    }
  } else if (cleanQuestion.includes('how') || cleanQuestion.includes('method') || cleanQuestion.includes('process')) {
    return {
      answer: `You're asking about processes or methods! Here are some study techniques for learning procedures:

1. **Step-by-step breakdown**: Write out each step clearly
2. **Visual flowcharts**: Map out the process visually
3. **Practice problems**: Apply the method to different scenarios
4. **Teach someone else**: Explain the process to reinforce learning
5. **Real examples**: Find practical applications

Your question was: "${question}"

For detailed AI explanations, install Ollama from https://ollama.ai and run: ollama pull llama3.2:1b`
    }
  } else if (cleanQuestion.includes('why') || cleanQuestion.includes('reason') || cleanQuestion.includes('cause')) {
    return {
      answer: `Great question about understanding reasons and causes! Here are study strategies for deeper comprehension:

1. **Ask "why" repeatedly**: Dig deeper into the reasoning
2. **Find connections**: Link concepts to underlying principles
3. **Historical context**: Understand how ideas developed
4. **Compare and contrast**: See how different approaches work
5. **Real-world impact**: Consider practical consequences

Your question was: "${question}"

To explore this topic with AI assistance, install Ollama from https://ollama.ai and run: ollama pull llama3.2:1b`
    }
  } else if (cleanQuestion.includes('when') || cleanQuestion.includes('time') || cleanQuestion.includes('history')) {
    return {
      answer: `You're asking about timing or historical context! Here are study strategies for temporal understanding:

1. **Timeline creation**: Map out key events chronologically
2. **Cause and effect**: See how events influence each other
3. **Context analysis**: Understand the conditions of the time
4. **Comparison**: See how things changed over time
5. **Pattern recognition**: Identify recurring themes

Your question was: "${question}"

For comprehensive AI analysis, install Ollama from https://ollama.ai and run: ollama pull llama3.2:1b`
    }
  } else {
    // General study advice for other types of questions
    return {
      answer: `I can see you have a great question about learning! While I can't provide the specific answer right now, here are some effective study strategies:

1. **Active reading**: Take notes, ask questions, summarize
2. **Spaced repetition**: Review material at increasing intervals
3. **Practice testing**: Quiz yourself on the material
4. **Interleaving**: Mix different topics during study sessions
5. **Elaboration**: Explain concepts in your own words

Your question was: "${question}"

To get AI-powered study assistance, install Ollama from https://ollama.ai and run: ollama pull llama3.2:1b

Remember: The best learning happens when you're actively engaged with the material!`
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a helpful study buddy AI. Answer the following question in a clear, educational way. Provide explanations, examples, and encourage learning. Be friendly and supportive.

Question: ${question}`

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3:latest',
          prompt: prompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      return NextResponse.json({ 
        answer: data.response || 'I could not process your question. Please try again!' 
      })
    } catch (ollamaError) {
      console.error('Ollama connection error:', ollamaError)
      
      // Generate helpful fallback study advice based on the question
      const fallbackAdvice = generateFallbackStudyAdvice(question)
      
      return NextResponse.json({
        ...fallbackAdvice,
        message: "Generated fallback study advice while Ollama is not available. Install Ollama for AI-powered study assistance.",
        ollamaStatus: "offline"
      })
    }
  } catch (error) {
    console.error('Study Buddy API error:', error)
    return NextResponse.json(
      { error: 'Failed to get study buddy response' },
      { status: 500 }
    )
  }
} 