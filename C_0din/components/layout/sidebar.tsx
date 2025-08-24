"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Mock chat history data
  const chatHistory = [
    {
      id: 1,
      title: "React useState Hook",
      timestamp: "2 hours ago",
      preview: "Explained useState hook with examples..."
    },
    {
      id: 2,
      title: "Python List Comprehension",
      timestamp: "1 day ago",
      preview: "Detailed breakdown of list comprehensions..."
    },
    {
      id: 3,
      title: "JavaScript Async/Await",
      timestamp: "2 days ago",
      preview: "Async programming patterns explained..."
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-80 bg-background border-r border-border shadow-lg"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Chat History
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
              <div className="p-4 space-y-3">
                {chatHistory.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Code className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{chat.preview}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">{chat.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}