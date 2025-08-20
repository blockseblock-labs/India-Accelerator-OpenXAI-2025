// components/CountryChat.tsx
"use client";

import React, { useState } from "react";
import { Orbitron, Exo_2 } from "next/font/google";
import { SendHorizonal, MessageSquare } from "lucide-react";

// Fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["700"] });
const exo2 = Exo_2({ subsets: ["latin"], weight: ["400", "500"] });

export default function CountryChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      // Call Ollama API
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2:1b", // ✅ using llama3.2:1b
          messages: [{ role: "user", content: input }],
          stream: false, // set true if you want to handle streaming
        }),
      });

      const data = await response.json();

      // Ollama returns response inside message.content
      const reply = data.message?.content || "⚠️ No response from Ollama";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Ollama error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Failed to connect to Ollama" }]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 transition transform hover:scale-105"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-80 h-96 bg-gray-900/95 border border-cyan-400/40 rounded-2xl flex flex-col shadow-[0_0_20px_rgba(0,255,255,0.4)] animate-fadeIn"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-400/30">
            <h2 className={`${orbitron.className} text-cyan-300 text-lg tracking-wide`}>
              Country Chat
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-400"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-sm scrollbar-thin scrollbar-thumb-cyan-500/40">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center mt-6">
                💬 Ask me about any country!
              </p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white self-end ml-auto"
                    : "bg-gray-800 text-cyan-200 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm">🤖 Thinking...</div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-cyan-400/30 flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about a country..."
              className={`${exo2.className} flex-1 px-3 py-2 text-sm rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white shadow-md shadow-cyan-500/40"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
