"use client"

import type React from "react"
import { useState } from "react"
import { Send, Bot, User, Sparkles, MessageCircle, Zap, Shield } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const assistantMessage: Message = { role: "assistant", content: "" }
      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage.role === "assistant") {
              lastMessage.content += chunk
            }
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your message.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-card">
      <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground tracking-tight">ChatFlow</h1>
              <p className="text-sm text-muted-foreground font-medium">AI-Powered Conversations</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-accent" />
              <span>Smart Responses</span>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-primary/5 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mb-4 mx-auto">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Ready to Chat</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Start a conversation and experience intelligent, contextual responses powered by advanced AI
                  technology.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-lg">
                  <button
                    onClick={() => setInput("What can you help me with?")}
                    className="p-3 text-left bg-muted/50 hover:bg-muted border border-border/50 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    What can you help me with?
                  </button>
                  <button
                    onClick={() => setInput("Explain quantum computing")}
                    className="p-3 text-left bg-muted/50 hover:bg-muted border border-border/50 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    Explain quantum computing
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25"
                          : "bg-gradient-to-br from-muted to-card border-2 border-border/50"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>

                    <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block px-4 py-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-md shadow-lg shadow-primary/20"
                            : "bg-card border border-border/50 text-card-foreground rounded-bl-md shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-sm font-body">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-muted to-card border-2 border-border/50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border/50 p-6 bg-muted/30 backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all shadow-sm font-body"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-muted-foreground/20 disabled:to-muted-foreground/20 disabled:text-muted-foreground text-primary-foreground px-5 py-3.5 rounded-2xl font-medium transition-all flex items-center gap-2 flex-shrink-0 shadow-lg shadow-primary/20 disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
