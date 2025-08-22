"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import Pet from "@/components/Pet";

export default function Home() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [hunger, setHunger] = useState(70);
  const [happiness, setHappiness] = useState(60);
  const [energy, setEnergy] = useState(80);

  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { from: "user", text: message }]);

    try {
      const res = await fetch("/api/pet-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { from: "pet", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center py-10 px-4 overflow-hidden">
      {/* 🎨 Animated Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-40 -right-32 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      {/* 🐾 Title + Info */}
      <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-md mb-3 relative z-10">
        🐶 Pixel Pet Studio
      </h1>
      <p className="text-gray-700 text-lg max-w-xl text-center mb-8 relative z-10">
        Take care of your adorable digital pet! Feed, play, and chat with your buddy.  
        Keep your pet happy, healthy, and full of energy ✨
      </p>

      {/* 🐕 Pet & Chat Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <Pet hunger={hunger} happiness={happiness} energy={energy} />
        <Chat messages={messages} onSend={sendMessage} />
      </div>
    </main>
  );
}
