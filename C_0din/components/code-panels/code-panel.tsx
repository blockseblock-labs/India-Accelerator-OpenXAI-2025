"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from "next-themes"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CodePanelProps {
  code: string
  language?: string
}

export function CodePanel({ code, language = "javascript" }: CodePanelProps) {
  // Ensure we have a valid language for syntax highlighting
  const validLanguage = language && ['javascript', 'typescript', 'jsx', 'tsx', 'java', 'python', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala'].includes(language) 
    ? language 
    : 'javascript'
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Commented Code</h3>
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md font-mono">
            {validLanguage}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <SyntaxHighlighter
          language={validLanguage}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.6',
            borderRadius: '8px'
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            textAlign: 'right',
            color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
            fontSize: '12px'
          }}
          codeTagProps={{
            style: {
              fontSize: '14px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }
          }}
          wrapLines={false}
          wrapLongLines={false}
        >
          {code || "// Your commented code will appear here"}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  )
}