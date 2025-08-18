"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, Settings, RefreshCw, Wifi, WifiOff, Sparkles, Zap, MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  modelName: string;
  isOnline: boolean;
  onClearChat: () => void;
  onSettings: () => void;
}

export function ChatHeader({ modelName, isOnline, onClearChat, onSettings }: ChatHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 dark-gradient-card border-b border-white/10 p-4"
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left side - Model info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {modelName}
                </span>
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <Wifi className="w-3 h-3 text-green-400" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
