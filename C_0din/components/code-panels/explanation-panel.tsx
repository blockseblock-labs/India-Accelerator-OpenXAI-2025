"use client"

import React from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookOpen } from "lucide-react"

interface ExplanationPanelProps {
  explanation: string
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/30">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Code Explanation</h3>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 list-disc list-inside space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 list-decimal list-inside space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-foreground">{children}</li>,
              code: ({ children }) => (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
              ),
            }}
          >
            {explanation || "Your code explanation will appear here once you submit some code for analysis."}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}