"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Pet from "@/components/Pet";
import PetControls from "@/components/PetControls";
import Chat from "@/components/Chat";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [petMood, setPetMood] = useState("happy");
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);

  const handleAction = (action: string) => {
    if (action === "feed") setPetMood("happy");
    if (action === "play") setPetMood("excited");
    if (action === "sleep") setPetMood("sleepy");

    setMessages((prev) => [
      ...prev,
      { from: "system", text: `You chose to ${action} your pet!` },
    ]);
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: message }]);

    // Simulated pet response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "pet", text: `*${petMood.toUpperCase()} noises* 🐾` },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left side: Pet + Controls */}
        <Card className="flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center">
            <Pet mood={petMood} />
            <PetControls onAction={handleAction} />
          </CardContent>
        </Card>

        {/* Right side: Chat */}
        <Card className="flex flex-col">
          <CardContent className="flex-1">
            <Chat messages={messages} onSend={handleSendMessage} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
