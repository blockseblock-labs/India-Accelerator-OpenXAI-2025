"use client";

import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  async function sendMessage() {
    if (!message.trim()) return;
    const pendingUser = message;
    setLoading(true);
    setMessage("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: pendingUser }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: pendingUser }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      <div className="chat-card">
        <div className="chat-header">
          <h1 className="title">Basic Chat</h1>
          <p className="subtitle">Chat with your local model through a clean UI.</p>
        </div>
        {error ? <div className="error-banner">{error}</div> : null}
        <div className="messages">
          {messages.length === 0 ? (
            <div className="message-row">
              <div className="bubble assistant">
                Say hello! Type a message below and press Send.
              </div>
            </div>
          ) : null}
          {messages.map((m, idx) => (
            <div key={idx} className={`message-row ${m.role === "user" ? "user" : "assistant"}`}>
              <div className={`bubble ${m.role}`}>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="composer">
          <input
            className="input"
            placeholder={loading ? "Thinking..." : "Type your message"}
            disabled={loading}
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="button" disabled={loading} onClick={sendMessage}>
            {loading ? <span className="spinner" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
