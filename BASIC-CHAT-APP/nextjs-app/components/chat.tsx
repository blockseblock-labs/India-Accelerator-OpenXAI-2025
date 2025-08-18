"use client";

import { useState, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  // For blinking dots animation
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!loading) {
      setDots("");
      return;
    }
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMsg: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg.content }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const botMsg: Message = { role: "bot", content: data.message };
      setMessages((prev) => [...prev, botMsg]);
      setError("");
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>CogNet-Cognitive Network</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          flexGrow: 1,
          marginBottom: 10,
          overflowY: "auto",
          borderRadius: 8,
          backgroundColor: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                backgroundColor: msg.role === "user" ? "#007bff" : "#eee",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}

        {loading && (
          <div
            style={{
              textAlign: "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                backgroundColor: "#eee",
                color: "black",
                maxWidth: "80%",
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Typing{dots}
            </span>
          </div>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: 10, fontSize: 16 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ marginLeft: 8, padding: "10px 20px", fontSize: 16 }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
