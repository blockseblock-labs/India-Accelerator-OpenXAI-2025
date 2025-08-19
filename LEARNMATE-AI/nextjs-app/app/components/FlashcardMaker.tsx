'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardMaker() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const generateFlashcards = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Sending prompt:', prompt); // Debug log

      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim() 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      try {
        const parsedCards = JSON.parse(data.response);
        setFlashcards(parsedCards);
      } catch (parseError) {
        console.error('Failed to parse response:', data.response);
        setError('Invalid response format from AI');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add loading state management
  useEffect(() => {
    // Preload any assets if needed
    const preloadAssets = async () => {
      // Add any asset preloading here
    };
    preloadAssets();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your topic for flashcards..."
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
          rows={4}
        />
        <button 
          onClick={generateFlashcards}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-300 
                     hover:bg-blue-600 transition-colors transform hover:scale-[1.02]"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : 'Generate Flashcards'}
        </button>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {flashcards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Generated Flashcards</h2>
            {flashcards.map((card, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3 className="font-bold">Front:</h3>
                <p>{card.front}</p>
                <h3 className="font-bold mt-2">Back:</h3>
                <p>{card.back}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}