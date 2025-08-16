import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    const prompt = `Analyze and summarize the following text content. Create a comprehensive summary in JSON format with the following structure:
{
  "summary": {
    "title": "Appropriate title for the content",
    "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "..."],
    "mainConcepts": ["Concept 1", "Concept 2", "Concept 3", "..."],
    "summary": "A concise 2-3 paragraph summary of the main content"
  }
}

Requirements:
- Extract 5-8 key points that capture the most important information
- Identify 4-6 main concepts/topics covered
- Write a clear, concise summary that captures the essence of the content
- Make the title descriptive and engaging
- Focus on the most essential information for studying

Text to summarize: ${text}`

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
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    try {
      // Try to parse JSON from the response
      const summaryMatch = data.response.match(/\{[\s\S]*\}/)
      if (summaryMatch) {
        const summaryData = JSON.parse(summaryMatch[0])
        return NextResponse.json(summaryData)
      }
    } catch (parseError) {
      console.log('Could not parse JSON, returning formatted response')
    }

    // Fallback: create a simple structure from the response
    const responseText = data.response || 'No response from model'
    const lines = responseText.split('\n').filter(line => line.trim())
    
    return NextResponse.json({
      summary: {
        title: "Summary of Your Notes",
        keyPoints: lines.slice(0, 5).map(line => line.replace(/^[-*•]\s*/, '')),
        mainConcepts: ["General Content", "Key Information", "Study Material"],
        summary: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '')
      }
    })
  } catch (error) {
    console.error('Summarizer API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}