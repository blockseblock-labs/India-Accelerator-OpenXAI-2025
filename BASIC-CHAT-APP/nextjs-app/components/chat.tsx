"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { ChatWelcome } from "./chat-welcome";
import { Button } from "./ui/button";
import { Trash2, Download, Share2, Sparkles, Zap, MessageCircle, Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check online status
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    checkOnlineStatus();

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const exportChat = () => {
    const chatText = messages
      .map(msg => `${msg.isUser ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareChat = async () => {
    if (navigator.share) {
      const chatText = messages
        .map(msg => `${msg.isUser ? 'You' : 'AI'}: ${msg.content}`)
        .join('\n\n');
      
      try {
        await navigator.share({
          title: 'AI Chat Conversation',
          text: chatText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      const chatText = messages
        .map(msg => `${msg.isUser ? 'You' : 'AI'}: ${msg.content}`)
        .join('\n\n');
      
      try {
        await navigator.clipboard.writeText(chatText);
        alert('Chat copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen dark-gradient-bg relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30"></div>
      </div>

      {/* Header */}
      <ChatHeader
        modelName="Llama 3.2 (1B)"
        isOnline={isOnline}
        onClearChat={clearChat}
        onSettings={() => console.log('Settings clicked')}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 ? (
              <ChatWelcome onSendMessage={sendMessage} />
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <ChatMessage
                    message=""
                    isUser={false}
                    timestamp={new Date()}
                    isTyping={true}
                  />
                )}
                
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <div className="dark-gradient-card rounded-lg px-4 py-3 text-red-400 text-sm border border-red-500/20">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {error}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Action buttons when messages exist */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3 px-4 pb-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={exportChat}
            className="text-xs dark-gradient-border hover-lift glow-primary"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareChat}
            className="text-xs dark-gradient-border hover-lift glow-secondary"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="text-xs dark-gradient-border hover-lift text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </motion.div>
      )}

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        placeholder={isOnline ? "Type your message..." : "You're offline. Check your connection."}
      />
    </div>
  );
}
