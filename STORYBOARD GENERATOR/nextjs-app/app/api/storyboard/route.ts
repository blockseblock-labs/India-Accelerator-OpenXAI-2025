import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: Request) {
  try {
    const { script } = await request.json();
    
    if (!script || script.trim() === '') {
      return NextResponse.json(
        { error: 'Script content is required' },
        { status: 400 }
      );
    }

    // Prepare the prompt for Ollama
    const prompt = `
    You are a professional storyboard artist. Based on the following script or story idea, 
    create a storyboard with 3-5 key scenes. For each scene, provide:
    1. A detailed description of the scene
    2. A clear image prompt that could be used to generate a visual representation

    Script/Story Idea:
    ${script}

    Format your response as a JSON array with objects containing:
    {
      "sceneNumber": 1,
      "description": "Detailed scene description",
      "imagePrompt": "Clear image generation prompt for this scene",
      "imageUrl": ""
    }
    `;

    // Call Ollama model
    const storyboard = await callOllamaModel(prompt);
    
    return NextResponse.json({ storyboard });
  } catch (error) {
    console.error('Error processing storyboard request:', error);
    return NextResponse.json(
      { error: 'Failed to generate storyboard' },
      { status: 500 }
    );
  }
}

async function callOllamaModel(prompt: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama3', '--json'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ollama.on('close', (code) => {
      if (code !== 0) {
        console.error(`Ollama process exited with code ${code}`);
        console.error(`Error output: ${errorOutput}`);
        
        // Fallback to mock data if Ollama fails
        const mockStoryboard = generateMockStoryboard();
        resolve(mockStoryboard);
        return;
      }

      try {
        // Parse the JSON response from Ollama
        // Note: Ollama might return multiple JSON objects, we need to parse the last complete one
        const jsonStrings = output.trim().split('\n');
        const lastJsonString = jsonStrings[jsonStrings.length - 1];
        const result = JSON.parse(lastJsonString);
        
        // Extract the storyboard from the response
        let storyboard;
        try {
          storyboard = JSON.parse(result.response);
        } catch (e) {
          // If parsing fails, try to extract JSON from the text
          const jsonMatch = result.response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            storyboard = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not parse storyboard JSON from response');
          }
        }
        
        resolve(storyboard);
      } catch (error) {
        console.error('Error parsing Ollama response:', error);
        
        // Fallback to mock data if parsing fails
        const mockStoryboard = generateMockStoryboard();
        resolve(mockStoryboard);
      }
    });

    // Send the prompt to Ollama
    ollama.stdin.write(prompt);
    ollama.stdin.end();
  });
}

// Fallback function to generate mock storyboard data
function generateMockStoryboard() {
  return [
    {
      sceneNumber: 1,
      description: "Opening scene: A writer sits at their desk, staring at a blank page, surrounded by crumpled papers. The room is dimly lit with only a desk lamp illuminating their frustrated expression.",
      imagePrompt: "Writer at desk with blank page, dimly lit room, crumpled papers, frustrated expression, desk lamp",
      imageUrl: ""
    },
    {
      sceneNumber: 2,
      description: "The writer begins typing frantically as inspiration strikes. We see close-ups of their fingers on the keyboard and their eyes lighting up with excitement.",
      imagePrompt: "Close-up of hands typing on keyboard, excited eyes, creative inspiration moment",
      imageUrl: ""
    },
    {
      sceneNumber: 3,
      description: "Final scene: The writer stands proudly in front of a movie poster featuring their name. The poster shows scenes from their screenplay that has now become a film.",
      imagePrompt: "Writer standing proudly in front of movie poster with their name, successful screenplay adaptation",
      imageUrl: ""
    }
  ];
}