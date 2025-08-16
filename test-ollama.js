// Save this as test-ollama.js and run with: node test-ollama.js

async function testOllama() {
    try {
      console.log('Testing Ollama connection...');
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3:latest',
          prompt: 'Create a simple flashcard from this: The capital of France is Paris. Return only JSON format: {"flashcards": [{"front": "question", "back": "answer"}]}',
          stream: false,
        }),
      });
  
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return;
      }
  
      const data = await response.json();
      console.log('Full response:', JSON.stringify(data, null, 2));
      console.log('Model response:', data.response);
  
      // Try to parse the flashcards
      const modelResponse = data.response.trim();
      const jsonMatch = modelResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const flashcards = JSON.parse(jsonMatch[0]);
          console.log('Parsed flashcards:', flashcards);
        } catch (e) {
          console.log('Could not parse as JSON:', e.message);
          console.log('Raw match:', jsonMatch[0]);
        }
      } else {
        console.log('No JSON found in response');
      }
  
    } catch (error) {
      console.error('Error:', error.message);
      console.error('Full error:', error);
    }
  }
  
  testOllama();