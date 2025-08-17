"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./ui/message-bubble";
import { LoadingSpinner } from "./ui/loading-spinner";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "SYSTEM ONLINE // Welcome to the CyberChat Interface. I'm your AI companion powered by advanced neural networks. How may I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Connection failed. Retry sequence initiated.");
      }
    } catch (err) {
      setError("Network error detected. Check your connection and retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "SYSTEM ONLINE // Welcome to the CyberChat Interface. I'm your AI companion powered by advanced neural networks. How may I assist you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto max-w-7xl p-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black cyber-gradient mb-3 glitch" data-text="CYBERCHAT">
            CYBERCHAT
          </h1>
          <p className="text-xl text-muted-foreground font-medium neon-text">
            NEURAL INTERFACE v2.0 • OPENXAI CORE
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-6xl mx-auto">
          <div className="cyber-bg rounded-2xl border border-primary/30 neon-glow overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/30 bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold text-foreground">NEURAL LINK ACTIVE</h2>
              </div>
              <button
                onClick={clearChat}
                className="text-sm text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/10 border border-primary/30 hover:border-primary/50"
              >
                RESET CONNECTION
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-[60vh] overflow-y-auto p-8 space-y-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isLoading && (
                <MessageBubble
                  content=""
                  role="assistant"
                  timestamp={new Date()}
                  isTyping={true}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-8 pb-6">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 neon-glow">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-primary/30 p-6 bg-secondary/20">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your neural transmission..."
                    disabled={isLoading}
                    className="w-full resize-none rounded-xl border border-primary/50 bg-background/80 text-foreground px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground/70"
                    rows={1}
                    style={{
                      minHeight: "56px",
                      maxHeight: "140px",
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 min-w-[140px] justify-center neon-glow-strong hover:neon-glow"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="text-primary-foreground" />
                      <span>TRANSMITTING</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>SEND</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center font-medium">
                Press Enter to transmit • Shift+Enter for multi-line
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>SYSTEM STATUS: OPERATIONAL</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-2 font-medium">
            Built with Next.js and Ollama • Powered by OpenXAI
          </p>
        </div>
      </div>
    </div>
  );
}
