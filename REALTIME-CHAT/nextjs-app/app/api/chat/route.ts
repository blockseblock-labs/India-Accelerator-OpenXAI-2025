import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// Read the model from the config file
function getModelName(): string {
  try {
    const modelPath = join(process.cwd(), '..', 'ollama-model.txt')
    const model = readFileSync(modelPath, 'utf-8').trim()
    return model || 'llama2' // fallback to llama2
  } catch (error) {
    console.warn('Could not read model from ollama-model.txt, using default: llama2')
    return 'llama2'
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    const model = getModelName()

    // Check if Ollama is running by trying to connect
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: message,
        stream: false,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model '${model}' not found. Please ensure Ollama is running and the model is installed.`)
      } else if (response.status === 0 || response.status >= 500) {
        throw new Error('Ollama service is not running. Please start Ollama first.')
      } else {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      message: data.response || 'No response from model' 
    })
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to process chat message'
    if (error instanceof Error) {
      if (error.message.includes('Ollama service is not running')) {
        errorMessage = 'Ollama is not running. Please start Ollama and try again.'
      } else if (error.message.includes('Model not found')) {
        errorMessage = 'The specified model is not installed. Please install it using: ollama pull [model-name]'
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to Ollama. Please ensure Ollama is running on localhost:11434'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 