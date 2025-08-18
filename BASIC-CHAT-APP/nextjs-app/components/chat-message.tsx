"use client";

import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils";
import { User, Bot, Sparkles, Zap, MessageCircle } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export function ChatMessage({ message, isUser, timestamp, isTyping = false }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <motion.div 
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            isUser 
              ? 'animated-gradient' 
              : 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800'
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </motion.div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <motion.div 
            className={`px-4 py-3 rounded-2xl ${
              isUser 
                ? 'chat-bubble-user rounded-br-md' 
                : 'chat-bubble-ai rounded-bl-md'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {isTyping ? (
              <div className="typing-indicator text-white">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                {!isUser && (
                  <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm leading-relaxed ${
                  isUser ? 'text-white' : 'text-gray-200'
                }`}>
                  {message}
                </p>
                {isUser && (
                  <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            )}
          </motion.div>
          
          {/* Timestamp */}
          <div className={`flex items-center gap-1 mt-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}>
            <MessageCircle className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              {formatTime(timestamp)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
