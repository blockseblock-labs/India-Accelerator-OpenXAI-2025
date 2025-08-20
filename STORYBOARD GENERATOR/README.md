# AI Storyboard Generator

A tool for writers and filmmakers where they can input a script or story idea, and the AI generates a visual storyboard with suggested scenes and character placements.

## Features

- **Text Input**: Enter your script or story concept in a simple text area
- **AI-Generated Scene Descriptions**: Get detailed descriptions for key scenes in your story
- **Image Prompts**: AI generates specific image prompts for each scene
- **Simple Image Generation**: Visualize your scenes with AI-generated images

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **AI Model**: Ollama with llama3:latest model
- **Image Generation**: Placeholder images (can be replaced with actual image generation API)

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- [Ollama](https://ollama.ai/) installed locally with the llama3 model

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd STORYBOARD\ GENERATOR/nextjs-app
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Make sure Ollama is installed and the llama3 model is available:
   ```
   ollama pull llama3
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter your script or story idea in the text area
2. Click "Generate Storyboard" to create a storyboard
3. Navigate through the scenes using the "Previous Scene" and "Next Scene" buttons
4. For each scene, click "Generate Image" to create a visual representation

## Notes

- The application uses Ollama's llama3 model for generating storyboards
- If Ollama is not available, the application will fall back to mock data
- Image generation currently uses placeholder images, but can be connected to an actual image generation API

## License

MIT