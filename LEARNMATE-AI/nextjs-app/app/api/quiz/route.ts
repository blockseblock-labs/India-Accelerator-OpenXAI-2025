import { NextRequest, NextResponse } from 'next/server'

// Helper function to generate quiz questions from text when Ollama is not available
function generateFallbackQuiz(text: string) {
  const questions = []
  
  // Clean and process the text
  const cleanText = text.trim().replace(/\s+/g, ' ')
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const words = cleanText.split(/\s+/).filter(w => w.length > 3)
  
  // Generate quiz questions based on content analysis
  if (sentences.length > 0) {
    // Question 1: Main topic
    const mainTopic = sentences[0].substring(0, 80).trim()
    questions.push({
      question: "What is the main topic discussed in this text?",
      options: [
        mainTopic + (mainTopic.length >= 80 ? "..." : ""),
        "A different topic not mentioned",
        "An unrelated subject",
        "None of the above"
      ],
      correct: 0,
      explanation: "The main topic is introduced in the opening of the text."
    })
    
    // Question 2: Key concept
    if (sentences.length >= 1) {
      const keyConcept = sentences[0].split(' ').slice(0, 6).join(' ')
      questions.push({
        question: "Which key concept is introduced at the beginning?",
        options: [
          keyConcept + "...",
          "A secondary concept",
          "An advanced topic",
          "A prerequisite concept"
        ],
        correct: 0,
        explanation: "The key concept is mentioned in the opening sentence."
      })
    }
    
    // Question 3: Important detail
    if (sentences.length >= 2) {
      const importantDetail = sentences[1].substring(0, 60).trim()
      questions.push({
        question: "What important detail is mentioned in the text?",
        options: [
          importantDetail + (importantDetail.length >= 60 ? "..." : ""),
          "A minor point",
          "An unrelated fact",
          "A future consideration"
        ],
        correct: 0,
        explanation: "This detail provides important context for understanding the topic."
      })
    }
    
    // Question 4: Definition question
    if (words.length > 5) {
      const keyWord = words.find(w => w.length > 5 && /^[A-Z]/.test(w)) || words[0]
      questions.push({
        question: `What does "${keyWord}" refer to in this context?`,
        options: [
          "A concept mentioned in the text",
          "An external reference",
          "A future topic",
          "An unrelated term"
        ],
        correct: 0,
        explanation: `${keyWord} is a key term that appears in your text and should be understood in context.`
      })
    }
    
    // Question 5: Application question
    questions.push({
      question: "How might this information be applied in practice?",
      options: [
        "By using the concepts described in the text",
        "By ignoring the main points",
        "By focusing only on examples",
        "By memorizing without understanding"
      ],
      correct: 0,
      explanation: "The practical application involves understanding and using the concepts described in your text."
    })
    
    // Question 6: Connection question
    questions.push({
      question: "What other topics might be related to this text?",
      options: [
        "Subjects that build upon these concepts",
        "Completely unrelated fields",
        "Only historical context",
        "Future developments only"
      ],
      correct: 0,
      explanation: "Related topics often include prerequisites, advanced concepts, or practical applications."
    })
  } else {
    // Fallback for very short text
    questions.push({
      question: "What is the main point of this text?",
      options: [
        text || "The text appears to be very brief",
        "A different topic entirely",
        "An unrelated subject",
        "None of the above"
      ],
      correct: 0,
      explanation: "The main point is directly stated in your text."
    })
  }
  
  return { quiz: questions }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const prompt = `Create a quiz from the following text. Generate 4-6 multiple choice questions in JSON format with the following structure:
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

Make questions challenging but fair, with plausible distractors for incorrect options. Vary question types (main ideas, details, applications, connections).

Text: ${text}`

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
        const quizMatch = data.response.match(/\{[\s\S]*\}/)
        if (quizMatch) {
          const quizData = JSON.parse(quizMatch[0])
          // Ensure we have multiple questions
          if (quizData.quiz && quizData.quiz.length >= 3) {
            return NextResponse.json(quizData)
          }
        }
      } catch (parseError) {
        console.log('Could not parse JSON, returning formatted response')
      }

      // Fallback: create a simple quiz structure
      return NextResponse.json({
        quiz: [
          {
            question: "What is the main topic of the provided text?",
            options: ["Topic A", "Topic B", "Topic C", "Topic D"],
            correct: 0,
            explanation: data.response || 'Generated from your text'
          }
        ]
      })
    } catch (ollamaError) {
      console.error('Ollama connection error:', ollamaError)
      
      // Generate smart fallback quiz based on the input
      const fallbackQuiz = generateFallbackQuiz(text)
      
      return NextResponse.json({
        ...fallbackQuiz,
        message: "Generated fallback quiz while Ollama is not available. Install Ollama for AI-powered quiz generation.",
        ollamaStatus: "offline"
      })
    }
  } catch (error) {
    console.error('Quiz API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
} 