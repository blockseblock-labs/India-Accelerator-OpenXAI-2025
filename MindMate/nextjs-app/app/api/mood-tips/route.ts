import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { mood, intensity, notes } = await request.json()

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood is required' },
        { status: 400 }
      )
    }

    const tips = generateMoodTips(mood, intensity, notes)

    return NextResponse.json({
      tips,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Mood tips API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMoodTips(mood: string, intensity: number = 5, notes?: string): string[] {
  const tips: string[] = []
  
  // Base tips based on mood
  switch (mood.toLowerCase()) {
    case 'happy':
    case 'excited':
      tips.push(
        "🌟 Share your joy with someone else today - happiness multiplies when shared!",
        "📝 Write down 3 things you're grateful for to amplify this positive feeling",
        "🎵 Listen to upbeat music to maintain this energy throughout the day"
      )
      break
      
    case 'sad':
    case 'depressed':
      tips.push(
        "💙 It's okay to feel sad - all emotions are valid and temporary",
        "🧘‍♀️ Try a 5-minute guided meditation to help process your feelings",
        "☕ Make yourself a warm drink and practice self-compassion"
      )
      break
      
    case 'stressed':
    case 'anxious':
      tips.push(
        "🫁 Practice the 4-7-8 breathing technique: inhale 4, hold 7, exhale 8",
        "📱 Take a 10-minute digital detox break from screens",
        "🚶‍♀️ Go for a short walk to help clear your mind"
      )
      break
      
    case 'tired':
    case 'exhausted':
      tips.push(
        "😴 Listen to your body - rest is essential for recovery",
        "💧 Stay hydrated and consider a short power nap (20 minutes max)",
        "🌿 Step outside for fresh air to help boost your energy naturally"
      )
      break
      
    case 'angry':
    case 'frustrated':
      tips.push(
        "🔥 Acknowledge your anger - it's a natural emotion that needs expression",
        "✍️ Write down your feelings in a journal to process them",
        "🎯 Channel this energy into physical activity like exercise or cleaning"
      )
      break
      
    case 'lonely':
    case 'isolated':
      tips.push(
        "🤗 Reach out to a friend or family member - connection heals",
        "📚 Join an online community or book club to meet like-minded people",
        "🐾 Consider volunteering or helping others to create meaningful connections"
      )
      break
      
    case 'calm':
    case 'peaceful':
      tips.push(
        "🌿 This peaceful state is perfect for reflection and creativity",
        "📖 Use this calm energy to journal or read something inspiring",
        "🎨 Try a creative activity like drawing, writing, or crafting"
      )
      break
      
    case 'neutral':
    default:
      tips.push(
        "😌 A neutral mood is perfectly fine - not every day needs to be extraordinary",
        "🔍 Use this balanced state to reflect on what brings you joy",
        "✨ Try something new today to add a little spark to your routine"
      )
      break
  }
  
  // Intensity-based tips
  if (intensity >= 8) {
    if (['happy', 'excited'].includes(mood.toLowerCase())) {
      tips.push("🎉 Your high energy is amazing! Channel it into something creative or share it with others!")
    } else if (['sad', 'stressed', 'anxious'].includes(mood.toLowerCase())) {
      tips.push("⚠️ These intense feelings might benefit from professional support. Consider reaching out to a counselor or therapist.")
    }
  } else if (intensity <= 3) {
    tips.push("💪 Even subtle emotions are important. Take time to acknowledge and honor how you're feeling.")
  }
  
  // Notes-based personalized tips
  if (notes && notes.trim().length > 0) {
    const lowerNotes = notes.toLowerCase()
    
    if (lowerNotes.includes('work') || lowerNotes.includes('job')) {
      tips.push("💼 Work stress is common. Try setting clear boundaries and taking regular breaks.")
    }
    
    if (lowerNotes.includes('relationship') || lowerNotes.includes('friend') || lowerNotes.includes('family')) {
      tips.push("❤️ Relationship challenges can be tough. Open communication often helps resolve misunderstandings.")
    }
    
    if (lowerNotes.includes('health') || lowerNotes.includes('sick')) {
      tips.push("🏥 Health concerns can affect our mood. Remember to be gentle with yourself during recovery.")
    }
    
    if (lowerNotes.includes('money') || lowerNotes.includes('financial')) {
      tips.push("💰 Financial stress is real and common. Consider talking to a financial advisor or counselor.")
    }
  }
  
  // Return 2-3 most relevant tips
  return tips.slice(0, 3)
}
