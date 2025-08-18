"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, MessageCircle, Lightbulb, Zap, Star, Rocket, Brain, Heart } from "lucide-react";

interface ChatWelcomeProps {
  onSendMessage: (message: string) => void;
}

const suggestedPrompts = [
  "Tell me a joke",
  "Explain quantum computing",
  "Write a short story",
  "Help me plan my day",
  "What's the weather like?",
  "Recommend a book"
];

const features = [
  {
    icon: Sparkles,
    title: "Smart Responses",
    description: "Powered by advanced AI models",
    color: "text-yellow-400"
  },
  {
    icon: MessageCircle,
    title: "Natural Conversation",
    description: "Chat naturally with context awareness",
    color: "text-blue-400"
  },
  {
    icon: Lightbulb,
    title: "Creative Ideas",
    description: "Get inspired with creative suggestions",
    color: "text-purple-400"
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Quick responses with high accuracy",
    color: "text-green-400"
  }
];

export function ChatWelcome({ onSendMessage }: ChatWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {/* Main Welcome */}
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full animated-gradient flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Bot className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Welcome to AI Chat
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg max-w-md mx-auto"
        >
          Start a conversation with your AI assistant. Ask anything, get creative, or just chat!
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex flex-col items-center p-4 rounded-lg dark-gradient-card hover:bg-white/10 transition-all duration-200 hover-lift"
          >
            <feature.icon className={`w-6 h-6 mb-2 ${feature.color}`} />
            <h3 className="font-semibold text-sm mb-1 text-white">{feature.title}</h3>
            <p className="text-xs text-gray-400 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Suggested Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-2xl"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Try these prompts:</h3>
          <Rocket className="w-5 h-5 text-blue-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedPrompts.map((prompt, index) => (
            <motion.div
              key={prompt}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <button
                className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 hover-lift text-white"
                onClick={() => onSendMessage(prompt)}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  {prompt}
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex items-center gap-2 text-gray-400 text-sm"
      >
        <Heart className="w-4 h-4 text-red-400" />
        <span>Crafted with ❤️ by Ayush</span>
        <Sparkles className="w-4 h-4 text-yellow-400" />
      </motion.div>
    </motion.div>
  );
}
