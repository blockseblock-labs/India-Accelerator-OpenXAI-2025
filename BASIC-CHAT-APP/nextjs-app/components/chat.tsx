"use client";

import { useState } from "react";
import "./chat.css";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string[]>([]);
  const [error, setError] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    setLoading(true);

    // Add user message
    setResponse((prev) => [...prev, `🧑 You: ${message}`]);

    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    })
      .then(async (res) => {
        if (res.ok) {
          await res.json().then((data) => {
            setError("");
            setResponse((prev) => [...prev, `🤖 Bot: ${data.message}`]);
          });
        } else {
          await res.json().then((data) => {
            setError(data.error);
          });
        }
      })
      .finally(() => {
        setMessage("");
        setLoading(false);
      });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 My Chat App</div>

      <div className="chat-window">
        {error && <div className="error">{error}</div>}
        {response.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              msg.startsWith("🧑") ? "user" : "bot"
            }`}
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          disabled={loading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button disabled={loading} onClick={sendMessage}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
