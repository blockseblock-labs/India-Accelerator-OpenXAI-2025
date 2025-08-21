import { NextResponse } from "next/server"

export async function GET() {
  // Return a simple SVG pattern as a placeholder texture
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#444" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#2a2a2a"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}

