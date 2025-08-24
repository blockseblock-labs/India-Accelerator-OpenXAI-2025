"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface InputBarProps {
  onSubmit: (code: string) => Promise<void>
  isLoading: boolean
}

export function InputBar({ onSubmit, isLoading }: InputBarProps) {
  const [code, setCode] = useState("")

  const handleSubmit = async () => {
    if (!code.trim() || isLoading) return
    
    await onSubmit(code)
    setCode("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full bg-background border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* Spacer to prevent content overlap */}
        <div className="h-6"></div>
        
        {/* Input container with ChatGPT-style design */}
        <div className="mx-4 mb-4">
          <div className="relative bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your code here and I'll explain it with detailed comments..."
              className="min-h-[120px] max-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground pr-16 py-4 px-4 text-sm leading-relaxed"
              disabled={isLoading}
            />
            
            {/* Submit button */}
            <div className="absolute bottom-4 right-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!code.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Instructions below input */}
          <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded-md">
              Press <kbd className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">Ctrl + Enter</kbd> to submit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}