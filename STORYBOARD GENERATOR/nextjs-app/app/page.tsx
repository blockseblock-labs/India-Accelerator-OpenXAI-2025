'use client'

import { useState } from 'react'

interface StoryboardScene {
  sceneNumber: number
  description: string
}

export default function StoryboardGenerator() {
  const [loading, setLoading] = useState(false)
  
  // Storyboard Generator states
  const [scriptInput, setScriptInput] = useState('')
  const [storyboard, setStoryboard] = useState<StoryboardScene[]>([])
  const [currentScene, setCurrentScene] = useState(0)

  const generateStoryboard = async () => {
    if (!scriptInput.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptInput })
      })
      
      const data = await response.json()
      if (data.storyboard) {
        // Remove image-related properties from the storyboard scenes
        const scenesWithoutImages = data.storyboard.map((scene: any) => ({
          sceneNumber: scene.sceneNumber,
          description: scene.description
        }))
        setStoryboard(scenesWithoutImages)
        setCurrentScene(0)
      }
    } catch (error) {
      console.error('Error generating storyboard:', error)
    }
    setLoading(false)
  }

  const handleNextScene = () => {
    if (currentScene < storyboard.length - 1) {
      setCurrentScene(currentScene + 1)
    }
  }

  const handlePrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">AI Storyboard Generator</h1>
        <p className="text-center mb-8 text-gray-600">A tool for writers and filmmakers to generate storyboards from scripts or story ideas</p>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Enter your script or story idea:</label>
            <textarea 
              className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder="Enter your script or story idea here..."
            />
          </div>
          
          <div className="flex justify-center">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={generateStoryboard}
              disabled={loading || !scriptInput.trim()}
            >
              {loading ? 'Generating...' : 'Generate Storyboard'}
            </button>
          </div>
        </div>
        
        {storyboard.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Storyboard</h2>
            
            <div className="flex justify-between items-center mb-4">
              <button 
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                onClick={handlePrevScene}
                disabled={currentScene === 0}
              >
                Previous Scene
              </button>
              <span className="font-medium">Scene {storyboard[currentScene].sceneNumber} of {storyboard.length}</span>
              <button 
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                onClick={handleNextScene}
                disabled={currentScene === storyboard.length - 1}
              >
                Next Scene
              </button>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Scene Description</h3>
              <p className="text-gray-800 leading-relaxed">{storyboard[currentScene].description}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}