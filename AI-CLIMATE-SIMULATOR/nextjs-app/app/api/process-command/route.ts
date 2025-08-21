// app/api/process-command/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { command, currentMetrics, pollutionLevel } = await req.json()

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt: `You are a climate simulator with visual effects capabilities. 
Return ONLY valid JSON (no extra text, no markdown).
The JSON must strictly match this schema:

{
  "co2Level": number,
  "toxicityLevel": number,
  "temperature": number,
  "humanPopulation": number,
  "animalPopulation": number,
  "plantPopulation": number,
  "oceanAcidity": number,
  "iceCapMelting": number,
  "visualEffects": {
    "type": string,
    "intensity": number,
    "duration": number,
    "particles": number,
    "color": string,
    "position": [number, number, number],
    "scale": number
  }
}

Simulate Earth's state after this command: "${command}". 

For visualEffects.type, choose from: "explosion", "fire", "smoke", "lightning", "storm", "earthquake", "tsunami", "drought", "flood", "pollution", "healing", "growth", "destruction", "construction", "transport", "industry", "agriculture", "deforestation", "reforestation", "urbanization", "desertification", "glacier", "volcano", "meteor", "nuclear", "moon", "god", "methane", "gas_cloud", "ice_melt", "permafrost", "custom"

SPECIAL EFFECTS FOR ENVIRONMENTAL COMMANDS:
- For methane/permafrost commands: use "methane" or "gas_cloud" type with green color (#00FF00 or #32CD32)
- For ice melting: use "ice_melt" type with blue/white colors
- For deforestation: use "destruction" type with brown colors
- For pollution: use "pollution" type with red/brown colors
- For natural disasters: use appropriate disaster type

IMPORTANT: Keep particles between 10-100 for performance. Keep intensity between 0.1-1.0. Keep scale between 0.5-2.0.
Make the visual effects match the command's environmental impact.`,
        stream: false,
      }),
    })

    const data = await response.json()
    console.log("Ollama response:", data)

    let parsed
    try {
      parsed = JSON.parse(data.response) // Ollama outputs raw text
      console.log("Parsed metrics:", parsed)
    } catch (err) {
      console.error("Failed to parse model response:", data.response)

      // fallback so MetricsPanel always gets valid data
      parsed = {
        co2Level: 420,
        toxicityLevel: 10,
        temperature: 25,
        humanPopulation: 8000000000,
        animalPopulation: 500000000000,
        plantPopulation: 2000000000000,
        oceanAcidity: 8.1,
        iceCapMelting: 5.0,
        visualEffects: {
          type: "pollution",
          intensity: 0.5,
          duration: 10,
          particles: 50,
          color: "#8B0000",
          position: [0, 0, 0],
          scale: 1.0
        }
      }
      console.log("Using fallback metrics:", parsed)
    }

    // Calculate new pollution level based on command impact
    let newPollutionLevel = pollutionLevel || 0
    let specialEvent = null

    // Analyze command for special events
    if (command.toLowerCase().includes('meteor')) {
      specialEvent = 'meteor'
      newPollutionLevel = Math.min(100, newPollutionLevel + 30)
    } else if (command.toLowerCase().includes('nuclear')) {
      specialEvent = 'nuclear'
      newPollutionLevel = Math.min(100, newPollutionLevel + 50)
    } else if (command.toLowerCase().includes('volcano')) {
      specialEvent = 'volcano'
      newPollutionLevel = Math.min(100, newPollutionLevel + 25)
    } else if (command.toLowerCase().includes('moon')) {
      specialEvent = 'moon'
      newPollutionLevel = Math.min(100, newPollutionLevel + 80)
    } else if (command.toLowerCase().includes('god')) {
      specialEvent = 'god'
      newPollutionLevel = Math.max(0, newPollutionLevel - 50)
    } else if (command.toLowerCase().includes('permafrost') || command.toLowerCase().includes('methane')) {
      specialEvent = 'permafrost'
      newPollutionLevel = Math.min(100, newPollutionLevel + 15)
    } else {
      // General pollution increase for other commands
      newPollutionLevel = Math.min(100, newPollutionLevel + 5)
    }

    // Ensure all required fields are present with fallback values
    const safeMetrics = {
      co2Level: parsed.co2Level ?? 420,
      toxicityLevel: parsed.toxicityLevel ?? 10,
      temperature: parsed.temperature ?? 25,
      humanPopulation: parsed.humanPopulation ?? 8000000000,
      animalPopulation: parsed.animalPopulation ?? 500000000000,
      plantPopulation: parsed.plantPopulation ?? 2000000000000,
      oceanAcidity: parsed.oceanAcidity ?? 8.1,
      iceCapMelting: parsed.iceCapMelting ?? 5.0,
      visualEffects: parsed.visualEffects ?? (() => {
        // Special fallback for permafrost/methane commands
        if (command.toLowerCase().includes('permafrost') || command.toLowerCase().includes('methane')) {
          return {
            type: "methane",
            intensity: 0.8,
            duration: 15,
            particles: 80,
            color: "#00FF00",
            position: [0, 0, 0],
            scale: 1.5
          }
        }
        // Default fallback
        return {
          type: "pollution",
          intensity: 0.5,
          duration: 10,
          particles: 50,
          color: "#8B0000",
          position: [0, 0, 0],
          scale: 1.0
        }
      })()
    }
    
    console.log("Final safe metrics:", safeMetrics)

    // Return the complete response structure the frontend expects
    return NextResponse.json({
      metrics: safeMetrics,
      pollutionLevel: newPollutionLevel,
      specialEvent: specialEvent,
      analysis: `Command "${command}" processed. Impact: ${specialEvent ? `Special event: ${specialEvent}` : 'General environmental impact'}. Pollution level increased to ${newPollutionLevel.toFixed(1)}%.`
    })
  } catch (error) {
    console.error("Error in /api/process-command:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}



