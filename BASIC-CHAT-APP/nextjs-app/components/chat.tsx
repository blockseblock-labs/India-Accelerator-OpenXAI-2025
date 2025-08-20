"use client";

import { useEffect, useRef, useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assistant, setAssistant] = useState("");
  const [lastUser, setLastUser] = useState<string | null>(null);

  // Buffered queue for smooth typing
  const bufferRef = useRef<string[]>([]);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const startTypingLoop = () => {
    if (typingTimerRef.current) return;
    typingTimerRef.current = setInterval(() => {
      const take = 2; // characters per tick for fluid feel
      const chunk = bufferRef.current.splice(0, take).join("");
      if (chunk) {
        setAssistant((prev) => prev + chunk);
        // auto scroll
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }
      if (bufferRef.current.length === 0 && !loading) {
        // nothing left and stream ended
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
      }
    }, 16); // ~60fps
  };

  const send = async () => {
    if (!message.trim() || loading) return;
    const toSend = message;
    setLastUser(toSend);
    setMessage("");
    setAssistant("");
    setError("");
    bufferRef.current = [];
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: toSend }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      (async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            bufferRef.current.push(...chunk.split(""));
            startTypingLoop();
          }
        }
      })()
        .catch((streamErr) => {
          const msg = streamErr instanceof Error ? streamErr.message : "Stream error";
          setError(msg);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Network error. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="card chat-window">
      <div className="messages" ref={messagesRef}>
        {error && <div className="message error">{error}</div>}
        {lastUser && <div className="message user">{lastUser}</div>}
        {assistant ? (
          <div className="message assistant">{assistant}</div>
        ) : (
          !lastUser && !error && (
            <div className="message assistant muted">Ask me anything to begin…</div>
          )
        )}
      </div>
      <div className="composer">
        <input
          className="input"
          placeholder="Type your message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={loading}
        />
        <button className="btn" onClick={send} disabled={loading}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {loading ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}
