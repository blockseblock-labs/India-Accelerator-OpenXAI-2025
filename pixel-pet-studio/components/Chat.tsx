"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatProps {
  messages: { from: string; text: string }[];
  onSend: (message: string) => void;
}

export default function Chat({ messages, onSend }: ChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] border rounded-2xl bg-white/90 shadow-lg p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[75%] transition-all ${
              msg.from === "user"
                ? "ml-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow"
                : msg.from === "pet"
                ? "bg-gradient-to-r from-pink-300 to-pink-400 text-gray-900 shadow"
                : "mx-auto text-gray-600 italic text-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to your pet..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow">
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
