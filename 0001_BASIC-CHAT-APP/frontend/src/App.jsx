import { useState } from 'react';
import ChatBox from './components/ChatBox';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'} min-h-screen flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Background image with very low opacity */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: "url('https://wallpapers.com/images/featured/dark-galaxy-wturp0ytecb3kpqq.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />
      {/* Header */}
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Chatbot using Ollama Model
      </h1>

      {/* Dark/Light mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Decorative shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/4 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-15 animate-pulse"></div>

      {/* Chat box */}
      <ChatBox darkMode={darkMode} />
    </div>
  );
}

export default App;
