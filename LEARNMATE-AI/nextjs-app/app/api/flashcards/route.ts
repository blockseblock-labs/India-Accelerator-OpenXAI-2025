import { NextRequest, NextResponse } from 'next/server'

// Helper function to generate flashcards from text when Ollama is not available
function generateFallbackFlashcards(notes: string) {
  const flashcards = []
  
  // Clean and process the notes
  const cleanNotes = notes.trim().replace(/\s+/g, ' ')
  const sentences = cleanNotes.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const words = cleanNotes.split(/\s+/).filter(w => w.length > 3)
  
  // Generate flashcards based on content analysis
  if (sentences.length > 0) {
    // Flashcard 1: Main topic
    const mainTopic = sentences[0].substring(0, 100).trim()
    flashcards.push({
      front: "What is the main topic of these notes?",
      back: mainTopic + (mainTopic.length >= 100 ? "..." : "")
    })
    
    // Flashcard 2: Key concept from first sentence
    if (sentences.length >= 1) {
      const keyConcept = sentences[0].split(' ').slice(0, 8).join(' ')
      flashcards.push({
        front: "Define the key concept mentioned in the beginning",
        back: keyConcept + "..."
      })
    }
    
    // Flashcard 3: Important fact
    if (sentences.length >= 2) {
      const importantFact = sentences[1].substring(0, 80).trim()
      flashcards.push({
        front: "What important fact is mentioned?",
        back: importantFact + (importantFact.length >= 80 ? "..." : "")
      })
    }
    
    // Flashcard 4: Definition question
    if (words.length > 5) {
      const keyWord = words.find(w => w.length > 5 && /^[A-Z]/.test(w)) || words[0]
      flashcards.push({
        front: `What does "${keyWord}" mean in this context?`,
        back: `Based on the notes: ${keyWord} refers to a concept or term mentioned in your study material. Review the context around this word for a complete definition.`
      })
    }
    
    // Flashcard 5: Summary question
    const summaryLength = Math.min(150, cleanNotes.length)
    flashcards.push({
      front: "Summarize the key points from your notes",
      back: cleanNotes.substring(0, summaryLength) + (cleanNotes.length > summaryLength ? "..." : "")
    })
    
    // Flashcard 6: Application question
    flashcards.push({
      front: "How can you apply the knowledge from these notes?",
      back: "Consider practical applications, real-world examples, or how this information connects to other topics you're studying."
    })
    
    // Flashcard 7: Connection question
    flashcards.push({
      front: "What other topics might connect to these notes?",
      back: "Think about related subjects, prerequisites, or advanced concepts that build upon this foundation."
    })
    
    // Flashcard 8: Review question
    flashcards.push({
      front: "What questions do you still have about this topic?",
      back: "Identify areas where you need more clarification, examples, or deeper understanding."
    })
  } else {
    // Fallback for very short notes
    flashcards.push({
      front: "What is the main point of your notes?",
      back: notes || "Your notes appear to be very brief. Try adding more detail for better flashcard generation."
    })
  }
  
  return { flashcards }
}

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()

    if (!notes) {
      return NextResponse.json(
        { error: 'Notes are required' },
        { status: 400 }
      )
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

Focus on key concepts, definitions, and important facts. Make questions clear and answers concise. Vary the question types (definitions, applications, connections, summaries).

Notes: ${notes}`

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
      
      try {
        // Try to parse JSON from the response
        const flashcardsMatch = data.response.match(/\{[\s\S]*\}/)
        if (flashcardsMatch) {
          const flashcardsData = JSON.parse(flashcardsMatch[0])
          // Ensure we have multiple flashcards
          if (flashcardsData.flashcards && flashcardsData.flashcards.length >= 3) {
            return NextResponse.json(flashcardsData)
          }
        }
      } catch (parseError) {
        // If JSON parsing fails, return a structured response
        console.log('Could not parse JSON, returning formatted response')
      }

      // Fallback: create a simple structure from the response
      return NextResponse.json({
        flashcards: [
          {
            front: "Generated from your notes",
            back: data.response || 'No response from model'
          }
        ]
      })
    } catch (ollamaError) {
      console.error('Ollama connection error:', ollamaError)
      
      // Generate smart fallback flashcards based on the input
      const fallbackFlashcards = generateFallbackFlashcards(notes)
      
      return NextResponse.json({
        ...fallbackFlashcards,
        message: "Generated fallback flashcards while Ollama is not available. Install Ollama for AI-powered flashcards.",
        ollamaStatus: "offline"
      })
    }
  } catch (error) {
    console.error('Flashcards API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
} 