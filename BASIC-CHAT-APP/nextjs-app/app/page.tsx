// app/page.tsx - Main Chat Component
'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple AI responses (you can replace with actual API call)
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting question! Let me think about that...",
      "I understand what you're asking. Here's my perspective...",
      "Great point! I'd love to explore that further with you.",
      "Thanks for sharing that with me. Let me help you with that.",
      "I see what you mean. That's definitely worth considering.",
      "That's a thoughtful question. Here's what I think...",
      "Interesting! I've been thinking about similar topics lately.",
      "I appreciate you asking. Let me break that down for you.",
    ];

    const greetings = ['hi', 'hello', 'hey', 'greetings'];
    const questions = ['what', 'how', 'why', 'when', 'where', 'who'];
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (greetings.some(greeting => lowerMessage.includes(greeting))) {
      return "Hello there! It's great to meet you. What would you like to chat about today?";
    }
    
    if (questions.some(question => lowerMessage.startsWith(question))) {
      return `${responses[Math.floor(Math.random() * responses.length)]} Regarding "${userMessage}", I think this is a fascinating topic that deserves a thoughtful response.`;
    }
    
    return `${responses[Math.floor(Math.random() * responses.length)]} You mentioned "${userMessage}" - that's something I find quite intriguing!`;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: generateAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg rounded-t-3xl border border-white/20 p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Chat Assistant</h1>
                <p className="text-white/70">Powered by Advanced AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Online</span>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg border-x border-white/20 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white ml-auto'
                      : 'bg-white/20 text-white border border-white/30'
                  } shadow-lg backdrop-blur-sm`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/20 text-white border border-white/30 px-4 py-3 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-b-3xl border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                className="w-full bg-white/20 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none backdrop-blur-sm"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-white/60">
            <div className="flex items-center space-x-4">
              <span>💬 {messages.length} messages</span>
              <span>🤖 AI Ready</span>
            </div>
            <div className="text-xs">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
