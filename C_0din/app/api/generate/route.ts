import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function callOllamaAPI(code: string) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: `You are an expert code reviewer and educator. Your task is to analyze the given code and provide:

1. A WELL-COMMENTED version of the code with professional, detailed inline comments explaining every important part
2. A comprehensive explanation of how the code works

IMPORTANT: The commented code should have detailed comments explaining:
- What each function/method does
- What each variable represents
- The logic behind algorithms
- Any important programming concepts used
- Best practices demonstrated

Code to analyze:
${code}

Please format your response EXACTLY as follows:

COMMENTED_CODE:
[Your well-commented version of the code here with detailed inline comments]

EXPLANATION:
[Your detailed explanation here]

Make sure the commented code is the same code but with extensive, helpful comments added.`,
        stream: false
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.response

    // Improved regex patterns for better parsing
    const commentedCodeMatch = responseText.match(/COMMENTED_CODE:\s*([\s\S]*?)(?=EXPLANATION:|$)/i)
    const explanationMatch = responseText.match(/EXPLANATION:\s*([\s\S]*?)$/i)

    let commentedCode = commentedCodeMatch ? commentedCodeMatch[1].trim() : code
    let explanation = explanationMatch ? explanationMatch[1].trim() : 'Code analysis completed.'

    // If no commented code found, try to add basic comments to the original code
    if (!commentedCodeMatch || commentedCode === code) {
      // Add basic comments to each line while preserving code structure
      const lines = code.split('\n')
      const commentedLines = lines.map((line, index) => {
        if (line.trim() === '') return line
        if (line.trim().startsWith('//')) return line
        if (line.trim().startsWith('/*')) return line
        if (line.trim().startsWith('*')) return line
        if (line.trim().startsWith('*/')) return line
        
        // Add comment based on line content
        let comment = ''
        if (line.includes('class ') || line.includes('interface ')) {
          comment = '// Class/Interface definition'
        } else if (line.includes('public ') || line.includes('private ') || line.includes('protected ')) {
          comment = '// Method declaration'
        } else if (line.includes('if ') || line.includes('else ')) {
          comment = '// Conditional statement'
        } else if (line.includes('for ') || line.includes('while ')) {
          comment = '// Loop statement'
        } else if (line.includes('return ')) {
          comment = '// Return statement'
        } else if (line.includes('=') && !line.includes('==') && !line.includes('!=')) {
          comment = '// Variable assignment'
        } else if (line.includes(';') && line.trim().length > 0) {
          comment = '// Statement execution'
        }
        
        // Preserve original code structure for syntax highlighting
        return comment ? `${line} ${comment}` : line
      })
      commentedCode = commentedLines.join('\n')
    }

    return {
      commentedCode,
      explanation
    }
  } catch (error) {
    console.error('Ollama API call failed:', error)
    throw new Error('Failed to connect to Ollama. Please ensure Ollama is running.')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code input is required' },
        { status: 400 }
      )
    }

    const response = await callOllamaAPI(code)

    // Detect language for better syntax highlighting
    let detectedLanguage = 'javascript'
    if (code.includes('public class') || code.includes('public static void main') || code.includes('System.out.println')) {
      detectedLanguage = 'java'
    } else if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
      detectedLanguage = 'python'
    } else if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('var ')) {
      detectedLanguage = 'javascript'
    } else if (code.includes('#include') || code.includes('int main') || code.includes('printf')) {
      detectedLanguage = 'cpp'
    }

    return NextResponse.json({
      commentedCode: response.commentedCode,
      explanation: response.explanation,
      language: detectedLanguage,
      success: true
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process code. Please try again.',
        success: false 
      },
      { status: 500 }
    )
  }
}