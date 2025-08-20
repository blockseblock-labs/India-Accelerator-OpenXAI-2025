'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string; }[]>([]);
  const [input, setInput] = useState('');
  const [character, setCharacter] = useState('wizard'); // Default character
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'Player', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/character-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim(), character }),
      });

      if (!response.ok) {
        throw new Error('Failed to get character response');
      }

      const data = await response.json();
      const characterResponse = { sender: character, text: data.message };
      setMessages((prevMessages) => [...prevMessages, characterResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'System', text: 'Error communicating with character.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black/50 p-8 rounded-xl shadow-2xl border border-purple-700 animate-fadeIn">
        <h1 className="text-7xl font-extrabold text-white mb-4 drop-shadow-lg text-center font-orbitron">
          <span className="text-purple-400">GAME</span>FORGE
        </h1>
        <p className="text-xl text-purple-200 mb-10 text-center font-rajdhani">
          Forge your destiny, pixel by pixel. An epic adventure awaits!
        </p>
        
        {/* Character Selection */}
        <div className="mb-6 text-center">
          <label htmlFor="character-select" className="text-purple-300 text-lg font-rajdhani mr-4">Choose your companion:</label>
          <select
            id="character-select"
            className="bg-gray-700 border border-purple-500 text-white text-md rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5 font-rajdhani"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
          >
            <option value="wizard">Mystic Wizard</option>
            <option value="warrior">Valiant Warrior</option>
            <option value="rogue">Shadowy Rogue</option>
          </select>
        </div>

        {/* Game Canvas and Chat Area */}
        <div className="bg-gray-800/70 p-6 rounded-lg backdrop-blur-sm border border-gray-700 mb-8 flex flex-col lg:flex-row">
          {/* Canvas - Placeholder for game visuals */}
          <div className="lg:w-7/10 w-full mb-6 lg:mb-0 lg:mr-6">
            <canvas 
              id="gameCanvas" 
              width="800" 
              height="500" 
              className="border-2 border-purple-500 rounded-lg mx-auto shadow-lg"
            >
              Your browser does not support the canvas element.
            </canvas>
            <p className="mt-5 text-md text-purple-300 opacity-90 text-center font-rajdhani">The arena is set. What moves will you make?</p>
          </div>

          {/* Chat Interface */}
          <div className="lg:w-3/10 w-full bg-gray-900/60 p-4 rounded-lg border border-gray-700 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-3 font-orbitron">Character Chat</h3>
            <div className="flex-grow overflow-y-auto pr-2 mb-4" style={{ maxHeight: '300px' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'Player' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.sender === 'Player' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-200'} font-rajdhani text-sm`}>
                    <strong className="capitalize">{msg.sender}:</strong> {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow p-3 rounded-l-lg bg-gray-700 border border-purple-500 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 font-rajdhani text-sm"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isLoading}
              />
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-r-lg transition-colors duration-300 font-rajdhani disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons (can be repurposed for game actions) */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-out font-rajdhani border border-purple-400 animate-pulse">
            Explore World
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-out font-rajdhani border border-gray-500">
            Check Inventory
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-out font-rajdhani border border-gray-500">
            Save Game
          </button>
        </div>
      </div>
    </main>
  )
} 