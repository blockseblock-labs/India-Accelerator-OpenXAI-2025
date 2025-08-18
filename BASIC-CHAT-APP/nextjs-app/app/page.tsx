"use client";

import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi, I’m your Copilot-style chatbot. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr",
        height: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b, #000)",
        color: "#f1f5f9",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          background: "#0f172a",
          padding: "1rem",
          borderRight: "1px solid #1e293b",
        }}
      >
        <h1 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Copilot Chat
        </h1>
        <ul>
          <li style={{ marginBottom: "0.5rem", cursor: "pointer" }}>New Chat</li>
          <li style={{ marginBottom: "0.5rem", cursor: "pointer" }}>History</li>
          <li style={{ marginBottom: "0.5rem", cursor: "pointer" }}>Settings</li>
        </ul>
      </aside>

      {/* Chat Window */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          height: "100%",
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "1rem",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: "0.75rem",
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1rem",
                  borderRadius: "1rem",
                  background: msg.role === "user" ? "#2563eb" : "#1e293b",
                  color: "#fff",
                  maxWidth: "70%",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "9999px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#f1f5f9",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}







