"use client";

import { useState } from "react";
import "./chat.css"; // <-- Import CSS file

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {error && <div className="message bot" style={{ color: "red" }}>{error}</div>}
        {response && <div className="message bot">{response}</div>}
        {message && <div className="message user">{message}</div>}
      </div>

      <div className="chat-input">
        <input
          disabled={loading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            const currentMessage = message; // Save before clearing
            setMessage("");
            fetch("/api/chat", {
              method: "POST",
              body: JSON.stringify({ message: currentMessage }),
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
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}



