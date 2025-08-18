"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Mic, Paperclip, Sparkles, Zap, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isLoading, placeholder = "Type your message..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 dark-gradient-card border-t border-white/10 p-4"
    >
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          disabled={isLoading}
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full resize-none rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black/50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[120px] transition-all duration-200"
              rows={1}
            />
            {message.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Voice Button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          disabled={isLoading}
        >
          <Mic className="w-4 h-4" />
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          size="icon"
          className="flex-shrink-0 animated-gradient shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 text-white" />
        </Button>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-2">
        <Zap className="w-3 h-3" />
        Press Enter to send, Shift+Enter for new line
        <MessageSquare className="w-3 h-3" />
      </div>
    </motion.div>
  );
}
