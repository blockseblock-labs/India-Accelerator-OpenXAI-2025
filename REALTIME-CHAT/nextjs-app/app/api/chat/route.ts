import { NextRequest, NextResponse } from 'next/server'

// Improved settings specifically tuned for TinyLlama
const AI_MODE_CONFIGS = {
  general: {
    model: 'tinyllama:latest',
    systemPrompt: `You are a helpful assistant. Give complete, direct answers.`,
    maxTokens: 100,
    temperature: 0.3
  },
  code: {
    model: 'tinyllama:latest',
    systemPrompt: `You are a coding assistant. Provide complete code examples with explanations.`,
    maxTokens: 150,
    temperature: 0.2
  },
  content: {
    model: 'tinyllama:latest',
    systemPrompt: `You are a content writer. Write complete, engaging content.`,
    maxTokens: 120,
    temperature: 0.4
  },
  study: {
    model: 'tinyllama:latest',
    systemPrompt: `You are a tutor. Give complete explanations in simple terms.`,
    maxTokens: 130,
    temperature: 0.3
  },
  data: {
    model: 'tinyllama:latest',
    systemPrompt: `You are a data analyst. Provide complete insights and explanations.`,
    maxTokens: 100,
    temperature: 0.2
  },
  creative: {
    model: 'tinyllama:latest',
    systemPrompt: `You are creative. Share complete creative ideas and stories.`,
    maxTokens: 140,
    temperature: 0.6
  }
}

// Test if Ollama is responsive
async function testOllamaHealth(): Promise<{ healthy: boolean; models: string[]; error?: string }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      return {
        healthy: true,
        models: data.models?.map((m: any) => m.name) || []
      }
    } else {
      return { 
        healthy: false, 
        models: [],
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    console.error('Ollama health check failed:', error)
    if (error instanceof Error && error.name === 'AbortError') {
      return { healthy: false, models: [], error: 'Connection timeout - Ollama may not be running' }
    }
    return { 
      healthy: false, 
      models: [], 
      error: error instanceof Error ? error.message : 'Unknown connection error'
    }
  }
}

// Improved prompt formatting for TinyLlama
function formatPromptForTinyLlama(systemPrompt: string, userMessage: string): string {
  // TinyLlama works better with simpler, more direct prompts
  return `${systemPrompt}

Question: ${userMessage}
Answer:`
}

// Post-process TinyLlama responses
function cleanTinyLlamaResponse(response: string, originalQuestion: string): string {
  let cleaned = response.trim()
  
  // Remove common prefixes that TinyLlama might add
  cleaned = cleaned.replace(/^(Answer:|A:|Response:|Reply:)\s*/i, '')
  
  // Remove incomplete sentences at the end (common with TinyLlama)
  const sentences = cleaned.split(/[.!?]+/)
  if (sentences.length > 1) {
    // Keep only complete sentences
    const completeSentences = sentences.slice(0, -1).filter(s => s.trim().length > 0)
    if (completeSentences.length > 0) {
      cleaned = completeSentences.join('. ').trim()
      if (!cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
        cleaned += '.'
      }
    }
  }
  
  // If response is too short or doesn't make sense, provide a fallback
  if (cleaned.length < 10 || !cleaned.includes(' ')) {
    return `I understand you're asking about "${originalQuestion}". Let me try to provide a helpful response, though I may need you to rephrase the question for a more detailed answer.`
  }
  
  return cleaned
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await req.json()
    const message = body.message?.trim() || ''
    const mode = body.mode || 'general'
    
    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    console.log(`[${mode.toUpperCase()}] Processing: "${message}"`)

    // Quick health check
    const health = await testOllamaHealth()
    if (!health.healthy) {
      return NextResponse.json({
        error: 'Ollama service is not responding',
        suggestion: 'Please start Ollama with: ollama serve',
        details: health.error || 'Connection failed'
      }, { status: 503 })
    }

    // Check if tinyllama is available
    const hasTinyLlama = health.models.some(model => 
      model.includes('tinyllama')
    )
    
    if (!hasTinyLlama) {
      return NextResponse.json({
        error: 'TinyLlama model not found',
        suggestion: 'Please run: ollama pull tinyllama:latest',
        details: `Available models: ${health.models.join(', ') || 'none'}`
      }, { status: 404 })
    }

    const modeConfig = AI_MODE_CONFIGS[mode as keyof typeof AI_MODE_CONFIGS] || AI_MODE_CONFIGS.general
    
    // Format prompt specifically for TinyLlama
    const prompt = formatPromptForTinyLlama(modeConfig.systemPrompt, message)

    console.log('Sending prompt to TinyLlama:', prompt)

    // Single attempt with longer timeout for TinyLlama
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('Request timed out after 45 seconds')
      controller.abort()
    }, 45000) // 45 second timeout for TinyLlama

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modeConfig.model,
          prompt: prompt,
          stream: false,
          options: {
            // Optimized settings for TinyLlama quality and completeness
            temperature: modeConfig.temperature,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 2048,           // Larger context for better responses
            num_predict: modeConfig.maxTokens,
            repeat_penalty: 1.1,
            stop: ["\nQuestion:", "\nQ:", "Question:", "Q:", "\nUser:", "User:"],
            // Performance settings
            num_thread: 4,
            num_batch: 512,
            // Force completion
            penalize_newline: false,
            seed: -1,
            mirostat: 2,           // Better text quality
            mirostat_eta: 0.1,
            mirostat_tau: 5.0
          }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        let aiResponse = data.response?.trim() || ''
        
        console.log('Raw TinyLlama response:', aiResponse)
        
        // Clean and improve the response
        aiResponse = cleanTinyLlamaResponse(aiResponse, message)
        
        console.log('Cleaned response:', aiResponse)

        const responseTime = Date.now() - startTime
        console.log(`✅ TinyLlama response completed in ${responseTime}ms`)

        return NextResponse.json({
          message: aiResponse,
          mode: mode,
          timestamp: new Date().toISOString(),
          responseTime: responseTime,
          modelUsed: modeConfig.model,
          originalLength: data.response?.length || 0,
          cleanedLength: aiResponse.length
        })
      } else {
        const errorText = await response.text()
        console.error('TinyLlama API error:', response.status, errorText)
        throw new Error(`Ollama error: ${response.status} - ${errorText}`)
      }
        
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('TinyLlama request timed out')
        return NextResponse.json({
          error: 'Request timed out after 45 seconds',
          suggestion: 'TinyLlama is very slow. Try a shorter, simpler question.',
          details: 'The model took too long to respond. This is normal for TinyLlama on the first request.',
          responseTime: Date.now() - startTime
        }, { status: 408 })
      } else {
        console.error('TinyLlama error:', error)
        throw error
      }
    }

  } catch (error) {
    console.error('Chat API error:', error)
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Try a simpler question or restart Ollama',
      responseTime: responseTime
    }, { status: 500 })
  }
}

// Enhanced health check endpoint
export async function GET() {
  try {
    const health = await testOllamaHealth()
    
    return NextResponse.json({
      status: health.healthy ? 'healthy' : 'unhealthy',
      ollama: health.healthy ? 'connected' : 'disconnected',
      models: health.models,
      error: health.error,
      timestamp: new Date().toISOString(),
      recommendations: {
        hasTinyLlama: health.models.some(m => m.includes('tinyllama')),
        suggestedCommands: [
          'ollama serve',
          'ollama pull tinyllama:latest',
          'ollama list',
          'ollama run tinyllama:latest "What is 2+2?"'
        ],
        tips: [
          'Keep questions short and simple for TinyLlama',
          'First response may take 30-60 seconds',
          'Subsequent responses should be faster',
          'Try questions like "What is the capital of France?" or "Explain photosynthesis"'
        ]
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}