import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // For now, return a mock transcription
    // In a real implementation, you would:
    // 1. Convert audio to text using a speech-to-text service
    // 2. Then send the text to Ollama for processing

    const mockTranscription = "This is a mock transcription of your audio recording."

    // Send transcription to Ollama for processing
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: `Please analyze this transcription and provide insights: "${mockTranscription}"`,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      transcription: mockTranscription,
      analysis: data.response || 'No analysis available'
    })
  } catch (error) {
    console.error('Transcribe API error:', error)
    return NextResponse.json(
      { error: 'Failed to process audio transcription' },
      { status: 500 }
    )
  }
} 