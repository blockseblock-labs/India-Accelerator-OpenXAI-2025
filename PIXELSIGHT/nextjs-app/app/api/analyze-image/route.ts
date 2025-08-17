import { NextRequest, NextResponse } from 'next/server'

// Accepts either:
// - JSON: { image: "data:image/png;base64,...." }
// - multipart/form-data: field "image" as a file
export async function POST(req: NextRequest) {
  try {
  const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
  const VISION_MODEL = process.env.OLLAMA_VISION_MODEL || 'llava:latest'
  const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 180000)

    const contentType = req.headers.get('content-type') || ''
    let base64Image: string | null = null

    if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => null as any)
      const image = body?.image as string | undefined
      if (image) {
        // Expect a data URL like: data:image/png;base64,XXXX
        const commaIdx = image.indexOf(',')
        base64Image = commaIdx !== -1 ? image.substring(commaIdx + 1) : image
      }
    } else {
      const formData = await req.formData()
      const imageFile = formData.get('image') as File | null
      if (imageFile && typeof (imageFile as any).arrayBuffer === 'function') {
        const ab = await imageFile.arrayBuffer()
        // Node runtime: use Buffer to get base64
        base64Image = Buffer.from(ab).toString('base64')
      }
    }

    if (!base64Image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

  // Vision prompt: single concise paragraph (2–4 sentences)
  const prompt = `You are a helpful vision assistant. Analyze the image and return ONLY one concise paragraph (2–4 sentences):
Describe what the scene shows, key objects/attributes (colors, textures, any text), relationships or activity/context, and one notable detail or inference.
No bullets, no numbering, no headings, no preface. Just a single compact paragraph.`

    // Call Ollama with vision model
    const controller = new AbortController()
    const to = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let visionRes: Response
    try {
    visionRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: VISION_MODEL,
          prompt,
          stream: false,
          images: [base64Image],
          system: 'Return exactly one concise paragraph (2–4 sentences). No bullets, no numbering, no extra text.',
        }),
        signal: controller.signal,
      })
    } catch (e) {
      clearTimeout(to)
      const message = e instanceof Error ? e.message : String(e)
      const isAbort = e instanceof Error && (e.name === 'AbortError' || /aborted|timeout/i.test(e.message))
      // Return 200 with a helpful message so the UI shows something
      return NextResponse.json({
        analysis: `Received image but could not reach Ollama at ${OLLAMA_HOST}. ${message}. ${isAbort ? 'Tip: first run can be slow—pull the vision model and increase OLLAMA_TIMEOUT_MS (e.g., 180000).' : 'Tip: ensure Ollama is running and accessible.'}`,
        confidence: 0.5,
      })
    } finally {
      clearTimeout(to)
    }

    if (!visionRes.ok) {
      const bodyText = await visionRes.text().catch(() => '')
      return NextResponse.json({
        analysis: `Received image but the vision model request failed (${visionRes.status}). Tip: ensure a vision-capable model like \"llava:latest\" is available. Upstream: ${bodyText.slice(0, 500)}`,
        confidence: 0.5,
      })
    }

    const data = await visionRes.json()
    let analysis = (data?.response as string | undefined) || 'No analysis available'
    // Post-process to ensure a single paragraph, remove bullets/numbering, limit to 2–4 sentences
    const normalize = (t: string) => t
      .replace(/\r\n|\r/g, ' ')
      .replace(/[\t ]+/g, ' ')
      .replace(/[•\u2022\u2023\u25E6]+\s*/g, '') // bullet characters
      .replace(/\s*[-–—]\s+/g, ' ') // leading dashes
      .replace(/\s*\(?(?:\d+|[ivx]+|[a-dA-D])\)?:?\s+/gi, ' ') // numbering like 1), 2:, a)
      .trim()
    const trimmed = normalize(analysis)
    const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean)
    const limited = sentences.slice(0, Math.min(4, Math.max(2, sentences.length)))
    analysis = limited.join(' ')

    return NextResponse.json({
      analysis,
      confidence: 0.9,
    })
  } catch (error) {
    console.error('Image analysis API error:', error)
    return NextResponse.json({
      analysis: 'Failed to analyze image. Please try again.',
    })
  }
}