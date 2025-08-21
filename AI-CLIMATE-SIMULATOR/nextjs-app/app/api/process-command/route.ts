import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      command,
      currentMetrics,
      pollutionLevel,
      model = "deepseek-r1:8b",
    } = await request.json();

    // Check for catastrophic events
    const lowerCommand = command.toLowerCase();
    let specialEvent = null;
    let isCatastrophic = false;
    let catastrophicType = "";

    if (
      lowerCommand.includes("meteor") ||
      lowerCommand.includes("asteroid") ||
      lowerCommand.includes("smash")
    ) {
      specialEvent = "meteor";
      isCatastrophic = true;
      catastrophicType = "meteor";
    } else if (
      lowerCommand.includes("nuclear") ||
      lowerCommand.includes("bomb") ||
      lowerCommand.includes("war")
    ) {
      specialEvent = "nuclear";
      isCatastrophic = true;
      catastrophicType = "nuclear";
    } else if (
      lowerCommand.includes("volcano") ||
      lowerCommand.includes("erupt")
    ) {
      specialEvent = "volcano";
      isCatastrophic = true;
      catastrophicType = "volcano";
    } else if (
      lowerCommand.includes("moon") ||
      lowerCommand.includes("lunar") ||
      lowerCommand.includes("crash")
    ) {
      specialEvent = "moon";
      isCatastrophic = true;
      catastrophicType = "moon";
    } else if (lowerCommand.includes("god") && lowerCommand.includes("save")) {
      specialEvent = "god";
      isCatastrophic = false;
      catastrophicType = "god";
    }

    // Adjust prompt based on model
    const isQwen = model.includes("qwen");
    const isDeepseekSmall =
      model.includes("deepseek-r1:1.5b") || model.includes("deepseek-r1:7b");
    const prompt = `
You are an environmental AI expert analyzing the impact of human actions on Earth. You must calculate realistic environmental effects and return them in JSON format.

Current Earth State:
- CO2 Level: ${currentMetrics.co2Level} ppm
- Air Toxicity: ${currentMetrics.toxicityLevel}%
- Temperature: ${currentMetrics.temperature}°C
- Human Population: ${currentMetrics.humanPopulation.toLocaleString()}
- Animal Population: ${currentMetrics.animalPopulation.toLocaleString()}
- Plant Population: ${currentMetrics.plantPopulation.toLocaleString()}
- Ocean pH: ${currentMetrics.oceanAcidity}
- Ice Cap Melting: ${currentMetrics.iceCapMelting}%
- Overall Pollution Level: ${pollutionLevel}%

User Command: "${command}"

${
  isCatastrophic
    ? `This is a CATASTROPHIC EVENT (${catastrophicType.toUpperCase()}) that will cause MASSIVE environmental destruction and population loss.`
    : ""
}

Calculate the environmental impact of this action. Consider:
1. CO2 emissions and their effect on atmospheric levels
2. Air pollution and toxicity increases
3. Temperature changes (global warming effects)
4. Impact on human population (health, mortality) - IMPORTANT: 
   - Deadly events KILL people, reducing population
   - Pollution and environmental damage can cause health problems and population decline
   - Adding vehicles/emissions typically harms human health, not improves it
5. Impact on animal populations (habitat loss, extinction)
6. Impact on plant populations (deforestation, growth)
7. Ocean acidification effects
8. Ice cap melting acceleration
9. Overall pollution level increase

CRITICAL LOGIC RULES:
- Adding vehicles/emissions = BAD for human health and population
- Pollution = BAD for all life forms
- Environmental damage = DECREASES populations, not increases them
- Only positive environmental actions (clean energy, conservation) should increase populations

${
  isCatastrophic
    ? `
CRITICAL: For catastrophic events like nuclear war, meteor impacts, and moon crashes:
- These events KILL massive numbers of people
- Human population MUST DECREASE significantly
- These are extinction-level threats to humanity
- Do NOT increase human population during deadly events
`
    : ""
}

${
  isCatastrophic
    ? `
For catastrophic events, use these guidelines:
- METEOR: Massive population loss (50-90%), extreme temperature rise, global devastation
- NUCLEAR: NUCLEAR WAR KILLS PEOPLE - human population MUST DECREASE by 70-95% due to explosions, radiation, nuclear winter, and societal collapse. This is a MASS EXTINCTION EVENT for humans.
- VOLCANO: Significant population loss (20-40%), massive CO2 release, global cooling then warming
- MOON: Complete extinction event (99%+ population loss), massive debris field, global firestorm, atmospheric destruction
`
    : ""
}

${
  catastrophicType === "god"
    ? `
For the GOD SAVE event, this is a MIRACULOUS HEALING that restores Earth to pristine condition:
- All metrics return to starting values (CO2: 415ppm, Toxicity: 5%, Temperature: 30°C, etc.)
- All populations restored to maximum (Humans: 9B, Animals: 100B, Plants: 1T)
- Pollution reduced to 0%
- This is a divine intervention that completely heals the planet
`
    : ""
}

${
  isQwen
    ? "Return a valid JSON object with this structure:"
    : isDeepseekSmall
    ? "IMPORTANT: Return ONLY a valid JSON object with this exact structure, no explanations or think tags:"
    : "Return ONLY a valid JSON object with this exact structure:"
}
{
  "analysis": "Detailed explanation of environmental impact",
  "metrics": {
    "co2Level": number,
    "toxicityLevel": number,
    "temperature": number,
    "humanPopulation": number,
    "animalPopulation": number,
    "plantPopulation": number,
    "oceanAcidity": number,
    "iceCapMelting": number
  },
  "pollutionLevel": number,
  "specialEvent": "${specialEvent || null}"
}

${
  isDeepseekSmall
    ? `CRITICAL: The specialEvent field MUST be set to "${
        specialEvent || null
      }" exactly as shown.`
    : ""
}

Ensure all numbers are realistic and within reasonable ranges. CO2: 0-2000 ppm, Toxicity: 0-100%, Temperature: -50 to 50°C, Populations: positive numbers, Ocean pH: 6.0-9.0, Ice Melting: 0-100%, Pollution: 0-100%.
${
  isQwen
    ? "Return only the JSON, no other text."
    : isDeepseekSmall
    ? "CRITICAL: Return ONLY the JSON object above, no explanations, no think tags, no code examples, just the JSON."
    : ""
}
`;

    // Call Ollama with the selected model
    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama request failed: ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    let responseText = ollamaData.response;

    // Debug logging for deepseek models
    if (
      model.includes("deepseek-r1:1.5b") ||
      model.includes("deepseek-r1:7b")
    ) {
      console.log("=== DEEPSEEK RESPONSE DEBUG ===");
      console.log("Model:", model);
      console.log("Special Event:", specialEvent);
      console.log("Full response:", responseText);
      console.log("Response length:", responseText.length);
      console.log("Contains <think>:", responseText.includes("<think>"));
      console.log("Contains {:", responseText.includes("{"));
      console.log("Contains }:", responseText.includes("}"));
      console.log("=== END DEBUG ===");
    }

    // Try to extract JSON from the response with multiple strategies
    let parsedResponse = null;

    // Strategy 1: Look for JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.log("JSON parse failed for matched content:", jsonMatch[0]);
      }
    }

    // Strategy 2: If no JSON found, try to parse the entire response
    if (!parsedResponse) {
      try {
        parsedResponse = JSON.parse(responseText.trim());
      } catch (parseError) {
        console.log("Full response parse failed:", responseText);
      }
    }

    // Strategy 3: Handle Qwen's think tags and extract JSON from within
    if (!parsedResponse && responseText.includes("<think>")) {
      // Remove think tags and try to find JSON
      const cleanText = responseText
        .replace(/<think>[\s\S]*?<\/think>/g, "")
        .trim();
      const cleanJsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (cleanJsonMatch) {
        try {
          parsedResponse = JSON.parse(cleanJsonMatch[0]);
        } catch (parseError) {
          console.log(
            "JSON parse failed for cleaned content:",
            cleanJsonMatch[0]
          );
        }
      }
    }

    // Strategy 4: Handle deepseek-r1:1.5b responses with explanations
    if (
      !parsedResponse &&
      (model.includes("deepseek-r1:1.5b") || model.includes("deepseek-r1:7b"))
    ) {
      // Remove all text before the first { and after the last }
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const extractedJson = responseText.substring(jsonStart, jsonEnd);
        try {
          parsedResponse = JSON.parse(extractedJson);
        } catch (parseError) {
          console.log(
            "JSON parse failed for extracted content:",
            extractedJson
          );
        }
      }
    }

    // Strategy 5: If still no JSON, create a fallback response
    if (!parsedResponse) {
      console.log("Creating fallback response for model:", model);
      console.log("Response that failed to parse:", responseText);

      // Create a more intelligent fallback based on the command
      const commandLower = command.toLowerCase();
      let co2Increase = 20;
      let toxicityIncrease = 5;
      let tempIncrease = 0.5;
      let humanLoss = 1000000;
      let animalLoss = 5000000;
      let plantLoss = 10000000;
      let pollutionIncrease = 3;

      // Adjust based on command type
      if (
        commandLower.includes("car") ||
        commandLower.includes("drive") ||
        commandLower.includes("transport")
      ) {
        co2Increase = 30;
        toxicityIncrease = 8;
        tempIncrease = 0.8;
        pollutionIncrease = 5;
      } else if (
        commandLower.includes("factory") ||
        commandLower.includes("industry") ||
        commandLower.includes("manufacture")
      ) {
        co2Increase = 50;
        toxicityIncrease = 15;
        tempIncrease = 1.2;
        pollutionIncrease = 10;
      } else if (
        commandLower.includes("deforest") ||
        commandLower.includes("cut") ||
        commandLower.includes("tree")
      ) {
        co2Increase = 40;
        plantLoss = 50000000;
        animalLoss = 10000000;
        pollutionIncrease = 8;
      } else if (
        commandLower.includes("pollute") ||
        commandLower.includes("waste") ||
        commandLower.includes("dump")
      ) {
        toxicityIncrease = 20;
        pollutionIncrease = 15;
        humanLoss = 2000000;
      }

      // For catastrophic events, ensure they have appropriate impact
      if (isCatastrophic) {
        if (catastrophicType === "nuclear") {
          co2Increase = 135;
          toxicityIncrease = 80;
          tempIncrease = -16; // Nuclear winter
          humanLoss = 7650000000; // 85% loss
          animalLoss = 50000000000;
          plantLoss = 300000000000;
          pollutionIncrease = 80;
        } else if (catastrophicType === "meteor") {
          co2Increase = 200;
          toxicityIncrease = 60;
          tempIncrease = 15; // Global warming from impact
          humanLoss = 8100000000; // 90% loss
          animalLoss = 90000000000;
          plantLoss = 800000000000;
          pollutionIncrease = 70;
        } else if (catastrophicType === "volcano") {
          co2Increase = 300;
          toxicityIncrease = 40;
          tempIncrease = -10; // Initial cooling, then warming
          humanLoss = 3600000000; // 40% loss
          animalLoss = 40000000000;
          plantLoss = 200000000000;
          pollutionIncrease = 50;
        } else if (catastrophicType === "moon") {
          co2Increase = 500; // Massive atmospheric disruption
          toxicityIncrease = 95; // Near complete atmospheric poisoning
          tempIncrease = 50; // Global firestorm
          humanLoss = 8991000000; // 99.9% loss - near extinction
          animalLoss = 99900000000; // 99.9% loss
          plantLoss = 999000000000; // 99.9% loss
          pollutionIncrease = 95; // Complete environmental collapse
        } else if (catastrophicType === "god") {
          // God saves the Earth - reset everything to pristine condition
          co2Increase = 415 - currentMetrics.co2Level; // Reset to 415ppm
          toxicityIncrease = 5 - currentMetrics.toxicityLevel; // Reset to 5%
          tempIncrease = 30 - currentMetrics.temperature; // Reset to 30°C
          humanLoss = currentMetrics.humanPopulation - 9000000000; // Restore to 9B
          animalLoss = currentMetrics.animalPopulation - 100000000000; // Restore to 100B
          plantLoss = currentMetrics.plantPopulation - 1000000000000; // Restore to 1T
          pollutionIncrease = 0 - pollutionLevel; // Reset to 0%
        }
      }

      parsedResponse = {
        analysis: `The command "${command}" will have environmental consequences. ${responseText.substring(
          0,
          200
        )}...`,
        metrics: {
          co2Level: Math.min(currentMetrics.co2Level + co2Increase, 2000),
          toxicityLevel: Math.min(
            currentMetrics.toxicityLevel + toxicityIncrease,
            100
          ),
          temperature: Math.min(currentMetrics.temperature + tempIncrease, 50),
          humanPopulation: Math.max(
            currentMetrics.humanPopulation - humanLoss,
            0
          ),
          animalPopulation: Math.max(
            currentMetrics.animalPopulation - animalLoss,
            0
          ),
          plantPopulation: Math.max(
            currentMetrics.plantPopulation - plantLoss,
            0
          ),
          oceanAcidity: Math.max(currentMetrics.oceanAcidity - 0.01, 6.0),
          iceCapMelting: Math.min(currentMetrics.iceCapMelting + 1, 100),
        },
        pollutionLevel: Math.min(pollutionLevel + pollutionIncrease, 100),
        specialEvent: specialEvent,
      };
    }

    // Validate and sanitize the response
    let validatedMetrics = {
      co2Level: Math.max(
        0,
        Math.min(
          parsedResponse.metrics?.co2Level || currentMetrics.co2Level,
          2000
        )
      ),
      toxicityLevel: Math.max(
        0,
        Math.min(
          parsedResponse.metrics?.toxicityLevel || currentMetrics.toxicityLevel,
          100
        )
      ),
      temperature: Math.max(
        -50,
        Math.min(
          parsedResponse.metrics?.temperature || currentMetrics.temperature,
          50
        )
      ),
      humanPopulation: Math.max(
        0,
        parsedResponse.metrics?.humanPopulation ||
          currentMetrics.humanPopulation
      ),
      animalPopulation: Math.max(
        0,
        parsedResponse.metrics?.animalPopulation ||
          currentMetrics.animalPopulation
      ),
      plantPopulation: Math.max(
        0,
        parsedResponse.metrics?.plantPopulation ||
          currentMetrics.plantPopulation
      ),
      oceanAcidity: Math.max(
        6.0,
        Math.min(
          parsedResponse.metrics?.oceanAcidity || currentMetrics.oceanAcidity,
          9.0
        )
      ),
      iceCapMelting: Math.max(
        0,
        Math.min(
          parsedResponse.metrics?.iceCapMelting || currentMetrics.iceCapMelting,
          100
        )
      ),
    };

    // Log any unusual AI responses for debugging
    if (
      isCatastrophic &&
      validatedMetrics.humanPopulation > currentMetrics.humanPopulation
    ) {
      console.log(
        "AI WARNING: Catastrophic event increased human population - this seems incorrect"
      );
      console.log("Event:", catastrophicType);
      console.log(
        "Population change:",
        currentMetrics.humanPopulation,
        "→",
        validatedMetrics.humanPopulation
      );
    }

    const validatedPollutionLevel = Math.max(
      0,
      Math.min(parsedResponse.pollutionLevel || pollutionLevel, 100)
    );

    // Create before/after comparison for the analysis
    const createComparisonText = () => {
      const changes = [];

      if (validatedMetrics.co2Level !== currentMetrics.co2Level) {
        const change = validatedMetrics.co2Level - currentMetrics.co2Level;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `CO₂: ${currentMetrics.co2Level}ppm ${direction} ${validatedMetrics.co2Level}ppm`
        );
      }

      if (validatedMetrics.toxicityLevel !== currentMetrics.toxicityLevel) {
        const change =
          validatedMetrics.toxicityLevel - currentMetrics.toxicityLevel;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Air Toxicity: ${currentMetrics.toxicityLevel}% ${direction} ${validatedMetrics.toxicityLevel}%`
        );
      }

      if (validatedMetrics.temperature !== currentMetrics.temperature) {
        const change =
          validatedMetrics.temperature - currentMetrics.temperature;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Temperature: ${currentMetrics.temperature}°C ${direction} ${validatedMetrics.temperature}°C`
        );
      }

      if (validatedMetrics.humanPopulation !== currentMetrics.humanPopulation) {
        const change =
          validatedMetrics.humanPopulation - currentMetrics.humanPopulation;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Humans: ${currentMetrics.humanPopulation.toLocaleString()} ${direction} ${validatedMetrics.humanPopulation.toLocaleString()}`
        );
      }

      if (
        validatedMetrics.animalPopulation !== currentMetrics.animalPopulation
      ) {
        const change =
          validatedMetrics.animalPopulation - currentMetrics.animalPopulation;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Animals: ${currentMetrics.animalPopulation.toLocaleString()} ${direction} ${validatedMetrics.animalPopulation.toLocaleString()}`
        );
      }

      if (validatedMetrics.plantPopulation !== currentMetrics.plantPopulation) {
        const change =
          validatedMetrics.plantPopulation - currentMetrics.plantPopulation;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Plants: ${currentMetrics.plantPopulation.toLocaleString()} ${direction} ${validatedMetrics.plantPopulation.toLocaleString()}`
        );
      }

      if (validatedMetrics.oceanAcidity !== currentMetrics.oceanAcidity) {
        const change =
          validatedMetrics.oceanAcidity - currentMetrics.oceanAcidity;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Ocean pH: ${currentMetrics.oceanAcidity} ${direction} ${validatedMetrics.oceanAcidity}`
        );
      }

      if (validatedMetrics.iceCapMelting !== currentMetrics.iceCapMelting) {
        const change =
          validatedMetrics.iceCapMelting - currentMetrics.iceCapMelting;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Ice Melting: ${currentMetrics.iceCapMelting}% ${direction} ${validatedMetrics.iceCapMelting}%`
        );
      }

      if (validatedPollutionLevel !== pollutionLevel) {
        const change = validatedPollutionLevel - pollutionLevel;
        const direction = change > 0 ? "↑" : "↓";
        changes.push(
          `Pollution: ${pollutionLevel}% ${direction} ${validatedPollutionLevel}%`
        );
      }

      return changes.length > 0 ? `\n\n📊 Changes:\n${changes.join("\n")}` : "";
    };

    const comparisonText = createComparisonText();
    const enhancedAnalysis =
      (parsedResponse.analysis ||
        "Environmental impact calculated successfully.") + comparisonText;

    const finalResponse = {
      analysis: enhancedAnalysis,
      metrics: validatedMetrics,
      pollutionLevel: validatedPollutionLevel,
      specialEvent: parsedResponse.specialEvent || specialEvent,
    };

    // Debug logging for final response
    if (
      model.includes("deepseek-r1:1.5b") ||
      model.includes("deepseek-r1:7b")
    ) {
      console.log("=== FINAL RESPONSE DEBUG ===");
      console.log("Model:", model);
      console.log("Final specialEvent:", finalResponse.specialEvent);
      console.log("Parsed specialEvent:", parsedResponse.specialEvent);
      console.log("Original specialEvent:", specialEvent);
      console.log("=== END FINAL DEBUG ===");
    }

    return NextResponse.json(finalResponse);
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
