// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'text/csv',
      'application/json',
      'text/markdown',
      'text/javascript',
      'text/typescript',
      'text/html',
      'text/css',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|csv|json|md|js|ts|html|css|xlsx|py|java|cpp|c)$/)) {
      return NextResponse.json({ 
        error: 'Unsupported file type. Supported: PDF, TXT, CSV, JSON, MD, JS, TS, HTML, CSS, XLSX, PY, JAVA, CPP, C' 
      }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size: 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads')
    
    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name}`
    const filepath = join(uploadDir, filename)

    try {
      await writeFile(filepath, buffer)
      console.log(`File uploaded successfully: ${filename}`)
    } catch (error) {
      console.error('Failed to write file:', error)
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }

    // Process file based on type
    let fileContent = '';
    let processedData: any = null;

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        fileContent = buffer.toString('utf-8')
      } else if (file.name.endsWith('.csv')) {
        fileContent = buffer.toString('utf-8')
        // You can add CSV parsing here using a library like papaparse
      } else if (file.name.endsWith('.json')) {
        fileContent = buffer.toString('utf-8')
        processedData = JSON.parse(fileContent)
      } else if (file.name.match(/\.(js|ts|html|css|py|java|cpp|c)$/)) {
        fileContent = buffer.toString('utf-8')
      } else if (file.type === 'application/pdf') {
        // For PDF processing, you'd need a library like pdf-parse
        fileContent = 'PDF file uploaded - content extraction requires additional processing'
      }
    } catch (error) {
      console.error('Error processing file content:', error)
      fileContent = 'File uploaded but content could not be processed'
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      content: fileContent.substring(0, 5000), // Limit content preview
      processedData: processedData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle file analysis requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  const action = searchParams.get('action')

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 })
  }

  try {
    const filepath = join(process.cwd(), 'uploads', filename)
    
    // Different analysis based on action
    switch (action) {
      case 'summarize':
        return NextResponse.json({
          summary: 'File summary functionality - integrate with AI model for content analysis'
        })
      case 'analyze':
        return NextResponse.json({
          analysis: 'File analysis functionality - integrate with AI model for detailed analysis'
        })
      case 'extract':
        return NextResponse.json({
          extracted: 'Key information extraction - integrate with AI model for data extraction'
        })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}