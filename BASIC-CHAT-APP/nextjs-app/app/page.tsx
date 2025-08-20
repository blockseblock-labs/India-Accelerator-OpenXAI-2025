"use client";
import { useState, useRef, useEffect } from "react";

type Message = { sender: "user" | "bot"; text: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, there was an error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "95vw",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          display: "flex",
          flexDirection: "column",
          height: 600,
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
            color: "#fff",
            padding: "22px 0 18px 0",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            fontWeight: 700,
            fontSize: 1.5 + "rem",
            textAlign: "center",
            letterSpacing: 1,
            boxShadow: "0 2px 8px #0001",
          }}
        >
          <span style={{ letterSpacing: 2 }}>💬 Chat with Llama 3</span>
        </div>
        <div
          style={{
            flex: 1,
            padding: "24px 16px 12px 16px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            background: "linear-gradient(135deg, #f1f5f9 0%, #fff 100%)",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)"
                      : "linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: "0 2px 8px #0001",
                  flexShrink: 0,
                }}
                title={msg.sender === "user" ? "You" : "Llama 3"}
              >
                {msg.sender === "user" ? "🧑" : "🤖"}
              </div>
              <div
                style={{
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)"
                      : "linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)",
                  color: "#222",
                  padding: "12px 18px",
                  borderRadius: 16,
                  borderTopLeftRadius: msg.sender === "user" ? 16 : 4,
                  borderTopRightRadius: msg.sender === "user" ? 4 : 16,
                  fontSize: 16,
                  maxWidth: "75%",
                  wordBreak: "break-word",
                  boxShadow: "0 1px 4px #0001",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "#64748b", fontWeight: 700 }}>
                  {msg.sender === "user" ? "You" : "Llama 3"}
                </span>
                <span style={{ marginLeft: 8 }}>{msg.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          style={{
            display: "flex",
            borderTop: "1px solid #e5e7eb",
            padding: "18px 16px",
            background: "#f8fafc",
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            gap: 10,
          }}
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={loading ? "Waiting for Llama 3..." : "Type a message..."}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1.5px solid #cbd5e1",
              borderRadius: 10,
              fontSize: 16,
              outline: "none",
              background: "#fff",
              transition: "border 0.2s",
              boxShadow: "0 1px 4px #0001",
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background:
                "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "0 28px",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.7 : 1,
              boxShadow: "0 2px 8px #0001",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
