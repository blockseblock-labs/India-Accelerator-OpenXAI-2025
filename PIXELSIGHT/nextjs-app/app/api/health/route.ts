import { NextResponse } from 'next/server'

export async function GET() {
  const host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
  try {
    const res = await fetch(`${host}/api/tags`, { cache: 'no-store' })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return NextResponse.json(
        { ok: false, error: `Upstream error ${res.status}: ${res.statusText}`, body, host },
        { status: 502 }
      )
    }
    const data = await res.json()
    const models = Array.isArray(data.models) ? data.models.map((m: any) => m.name) : []
    return NextResponse.json({ ok: true, host, models, visionModel: process.env.OLLAMA_VISION_MODEL || 'llava:latest' })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e), host },
      { status: 500 }
    )
  }
}
