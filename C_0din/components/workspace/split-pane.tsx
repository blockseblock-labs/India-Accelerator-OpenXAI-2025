"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { CodePanel } from "@/components/code-panels/code-panel"
import { ExplanationPanel } from "@/components/code-panels/explanation-panel"

interface SplitPaneProps {
  commentedCode: string
  explanation: string
  language?: string
}

export function SplitPane({ commentedCode, explanation, language }: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth)
      }
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full bg-background rounded-lg border border-border shadow-lg overflow-hidden"
    >
      {/* Left Panel - Code */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="border-r border-border bg-card"
      >
        <CodePanel code={commentedCode} language={language} />
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors ${
          isDragging ? 'bg-primary' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-current opacity-40" />
        </div>
      </div>

      {/* Right Panel - Explanation */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="bg-card"
      >
        <ExplanationPanel explanation={explanation} />
      </div>
    </motion.div>
  )
}