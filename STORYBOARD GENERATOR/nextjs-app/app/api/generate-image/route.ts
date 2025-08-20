import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Image prompt is required' },
        { status: 400 }
      );
    }

    // For demonstration purposes, we'll return placeholder images
    // In a real implementation, this would call an image generation API
    const imageUrl = getPlaceholderImage(prompt);
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

// Function to generate placeholder images based on the prompt
function getPlaceholderImage(prompt: string): string {
  // Create a hash of the prompt to get a consistent image for the same prompt
  const hash = Array.from(prompt)
    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
    .toString()
    .replace('-', '');
  
  // Use placeholder image services
  const imageServices = [
    `https://picsum.photos/seed/${hash}/800/600`,
    `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)}`,
    `https://placehold.co/800x600/eee/333?text=${encodeURIComponent(prompt.substring(0, 20))}`
  ];
  
  // Select one of the services based on the hash
  const serviceIndex = Math.abs(parseInt(hash.substring(0, 8), 16)) % imageServices.length;
  return imageServices[serviceIndex];
}