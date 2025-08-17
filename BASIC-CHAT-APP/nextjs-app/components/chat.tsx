"use client";

import React, { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi, I’m your AI assistant. How can I help today?" },
  ]);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userContent = message.trim();
    setMessage("");
    setLoading(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: userContent }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-app">
      <div className="chat-header">
        <div className="avatar">AI</div>
        <div className="chat-header__title">Basic Chat</div>
        <div className="chat-header__status">{loading ? "Generating…" : "Online"}</div>
      </div>

      <main className="chat-main">
        <div className="messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.role}`}>
              {m.role === "assistant" && <div className="avatar">AI</div>}
              <div className="bubble">{m.content}</div>
              {m.role === "user" && <div className="avatar">You</div>}
            </div>
          ))}
          {error && <div className="error">{error}</div>}
        </div>
      </main>

      <div className="input-bar">
        <div className="input-wrap">
          <input
            className="input"
            placeholder="Ask anything…"
            value={message}
            disabled={loading}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" disabled={loading} onClick={sendMessage}>
            {loading ? <span className="spinner" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
