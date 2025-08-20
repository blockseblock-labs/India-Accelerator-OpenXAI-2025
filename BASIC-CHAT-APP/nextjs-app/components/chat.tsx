"use client";

import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
  <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
    {error && <span style={{ color: "red", display: "block", marginBottom: 8 }}>{error}</span>}
    <span style={{ display: "block", minHeight: 40, marginBottom: 12 }}>{response}</span>
    <div style={{ display: "flex", gap: 8 }}>
      <input
        disabled={loading}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #aaa" }}
        placeholder="Type your message..."
      />
      <button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setMessage("");
          fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
              message,
            }),
          })
            .then(async (res) => {
              if (res.ok) {
                await res.json().then((data) => {
                  setError("");
                  setResponse(data.message);
                });
              } else {
                await res.json().then((data) => {
                  setError(data.error);
                  setResponse("");
                });
              }
            })
            .finally(() => setLoading(false));
        }}
        style={{ padding: "8px 16px", borderRadius: 4, background: "#fff700ff", color: "#fff", border: "none" }}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  </div>
);
    <div>
      {error && <span style={{ color: "green" }}>{error}</span>}
      <span>{response}</span>
      <div>
        <input
          disabled={loading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setMessage("");
            fetch("/api/chat", {
              method: "POST",
              body: JSON.stringify({
                message,
              }),
            })
              .then(async (res) => {
                if (res.ok) {
                  await res.json().then((data) => {
                    setError("");
                    setResponse(data.message);
                  });
                } else {
                  await res.json().then((data) => {
                    setError(data.error);
                    setResponse("");
                  });
                }
              })
              .finally(() => setLoading(false));
          }}
        >
          Send
        </button>
      </div>
    </div>
  
}
