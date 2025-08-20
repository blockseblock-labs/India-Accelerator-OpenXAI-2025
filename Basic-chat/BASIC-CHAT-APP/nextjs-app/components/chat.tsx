"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (res.ok) {
        setError("");
        setResponse(data.message);
      } else {
        setError(data.error || "Something went wrong");
        setResponse("");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-center">💬 Chat</h2>

          {/* Response or Error */}
          <div className="min-h-[100px] p-3 bg-gray-100 rounded-lg overflow-y-auto text-sm">
            {error && <p className="text-red-500">{error}</p>}
            {response && <p className="text-gray-800">{response}</p>}
            {!response && !error && (
              <p className="text-gray-400 italic">Start the conversation...</p>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
