import { NextRequest, NextResponse } from "next/server";

// Helper function to estimate solar setup
function estimateSolarSetup(energyKWh: number) {
  // Assume 1 solar panel produces ~4kWh/day (standard 400W panel, 5 hours sun)
  const panelKWhPerDay = 4;
  const panelCount = Math.ceil(energyKWh / panelKWhPerDay);

  // Battery: Assume 1 day autonomy, so battery size = energyKWh
  // Use 48V batteries, so Ah = (energyKWh * 1000) / 48
  const batteryKWh = energyKWh;
  const batteryAh = Math.ceil((energyKWh * 1000) / 48);

  // Inverter: Should handle peak load, assume 1.5x daily average
  const inverterKW = Math.ceil((energyKWh / 24) * 1.5);

  // CO2 savings: Assume 0.8kg CO2/kWh (India grid average)
  const co2SavedKg = Math.round(energyKWh * 0.8);

  return {
    panelCount,
    batteryKWh,
    batteryAh,
    inverterKW,
    co2SavedKg,
  };
}

export async function POST(request: NextRequest) {
  try {
    const {
      command,
      currentMetrics,
      pollutionLevel,
      model = "deepseek-r1:8b",
    } = await request.json();

    const lowerCommand = command.toLowerCase();
    let analysis = "";
    let metrics = { ...currentMetrics };
    let specialEvent = null;

    // Detect energy requirement (e.g., "I need 10kWh per day")
    const energyMatch = lowerCommand.match(/(\d+(\.\d+)?)\s*kwh/);
    if (
      lowerCommand.includes("solar") ||
      lowerCommand.includes("energy") ||
      lowerCommand.includes("battery") ||
      lowerCommand.includes("inverter")
    ) {
      if (energyMatch) {
        const energyKWh = parseFloat(energyMatch[1]);
        const solar = estimateSolarSetup(energyKWh);

        analysis = `To meet your daily energy requirement of ${energyKWh} kWh using solar power:
- You need approximately ${solar.panelCount} solar panels (400W each).
- Battery storage required: ${solar.batteryKWh} kWh (${solar.batteryAh}Ah at 48V).
- Recommended inverter size: ${solar.inverterKW} kW.
- By using solar, you can save about ${solar.co2SavedKg} kg of CO₂ emissions per day.

This solution helps reduce pollution and supports a sustainable future.`;

        // Update metrics for CO2 savings
        metrics.co2Level = Math.max(metrics.co2Level - solar.co2SavedKg / 100, 0); // Reduce ppm
        metrics.toxicityLevel = Math.max(metrics.toxicityLevel - 1, 0);
        metrics.temperature = Math.max(metrics.temperature - 0.01, -50);
        specialEvent = "solar_suggestion";
      } else {
        analysis =
          "Please specify your daily energy requirement in kWh (e.g., 'I need 10kWh per day') to get a solar solution.";
      }
    } else {
      analysis =
        "Please describe your energy or pollution problem. For solar solutions, mention your daily energy need in kWh.";
    }

    // Return the response
    return NextResponse.json({
      analysis,
      metrics,
      pollutionLevel: Math.max(pollutionLevel - 1, 0),
      specialEvent,
    });
  } catch (error) {
    console.error("Error processing command:", error);
    return NextResponse.json(
      {
        error: "Failed to process command",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}