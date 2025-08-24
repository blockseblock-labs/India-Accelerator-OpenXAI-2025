"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { SplitPane } from "@/components/workspace/split-pane"
import { InputBar } from "@/components/input/input-bar"
import { Code, Sparkles, Zap } from "lucide-react"

interface APIResponse {
  commentedCode: string
  explanation: string
  language?: string
  success: boolean
  error?: string
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [commentedCode, setCommentedCode] = useState("")
  const [explanation, setExplanation] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState("javascript")

  const handleCodeSubmit = async (code: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data: APIResponse = await response.json()

      if (data.success) {
        setCommentedCode(data.commentedCode)
        setExplanation(data.explanation)
        setDetectedLanguage(data.language || 'javascript')
      } else {
        console.error('API Error:', data.error)
        // Handle error state here
      }
    } catch (error) {
      console.error('Request failed:', error)
      // Handle error state here  
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 pt-16 pb-4 px-4 overflow-y-auto">
        <div className="min-h-full max-w-7xl mx-auto">
          {commentedCode || explanation ? (
            <SplitPane
              commentedCode={commentedCode}
              explanation={explanation}
              language={detectedLanguage}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="min-h-full flex items-center justify-center py-8"
            >
              <div className="text-center space-y-8 max-w-2xl px-4">
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 mb-2"
                  >
                    <div className="text-primary text-3xl font-mono font-bold">{"</>"}</div>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-mono leading-tight">
                    C_0din ; ur well-coder
                  </h1>
                  
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    Paste your code below and get instant, detailed explanations with professional comments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base">Smart Comments</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get professional inline comments that explain every part of your code clearly and concisely.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base">Detailed Explanations</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Understand complex algorithms and patterns with step-by-step breakdowns in plain English.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base">Multi-language Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Works with JavaScript, Python, and many other programming languages with proper syntax highlighting.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <InputBar onSubmit={handleCodeSubmit} isLoading={isLoading} />
    </div>
  )
}