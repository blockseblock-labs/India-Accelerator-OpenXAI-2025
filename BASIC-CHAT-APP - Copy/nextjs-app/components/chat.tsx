"use client";

import React, { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! Ask me anything.",
    },
  ]);
  const [error, setError] = useState<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  function createId() {
    return Math.random().toString(36).slice(2);
  }

  async function sendMessage() {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: String(data.message ?? ""),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi! Ask me anything.",
      },
    ]);
    setError("");
    setInputValue("");
    textareaRef.current?.focus();
  }

  return (
    <div className="chat-card" role="region" aria-label="Chat">
      <div ref={listRef} className="messages" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {isSending && (
          <div className="message assistant">
            <div className="bubble typing">Assistant is typing…</div>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="composer">
        <textarea
          ref={textareaRef}
          className="textarea"
          placeholder="Type your message…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isSending}
          aria-label="Message"
        />
        <div className="actions">
          <button
            className="btn"
            type="button"
            onClick={clearChat}
            disabled={isSending || messages.length <= 1}
            aria-label="Clear chat"
          >
            Clear
          </button>
          <button
            className="btn primary"
            type="button"
            onClick={sendMessage}
            disabled={isSending || !inputValue.trim()}
            aria-label="Send message"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
      <div className="footer-note muted">Shift+Enter for new line</div>
    </div>
  );
}
