"use client";

import { useState } from "react";

export function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi, I’m your Copilot-style chatbot. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role}`}
          >
            {msg.content}
          </div>
        ))}
        {error && <div className="message bot" style={{ color: "red" }}>{error}</div>}
      </div>

      <div className="chat-input">
        <input
          disabled={loading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button disabled={loading} onClick={sendMessage}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}




