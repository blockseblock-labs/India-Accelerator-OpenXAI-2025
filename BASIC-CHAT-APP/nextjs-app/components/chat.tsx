"use client";

import { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string; time: string }[]>([]);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: "user", text: message, time: timestamp }]);
    setLoading(true);
    const currentMessage = message;
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: currentMessage }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [...prev, { role: "bot", text: data.message, time: botTime }]);
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="avatar">{m.role === "user" ? "🧑" : "🤖"}</div>
            <div className="message-content">
              <p>{m.text}</p>
              <span className="timestamp">{m.time}</span>
            </div>
          </div>
        ))}
        {error && (
          <div className="chat-message bot error">
            ⚠️ {error}
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          disabled={loading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button disabled={loading} onClick={sendMessage}>
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}
