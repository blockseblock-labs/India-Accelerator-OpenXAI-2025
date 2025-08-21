"use client";

import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("Hi! It's nice to meet you. Is there something I can help you with or would you like to chat?");
  const [error, setError] = useState("");

  return (
    <div className="chat-container">
      <div className={error ? "response-area error" : "response-area"}>
        {error || response}
      </div>
      
      <div className="input-area">
        <input
          className="chat-input"
          disabled={loading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
               // Optional: Allow sending with Enter key
               // We'll add the function here if you want
            }
          }}
          placeholder="Type your message here..."
        />
        <button
          className="send-button"
          disabled={loading || !message} // Also disable if input is empty
          onClick={() => {
            setLoading(true);
            setResponse(""); // Clear previous response
            setError(""); // Clear previous error
            fetch("/api/chat", {
              method: "POST",
              body: JSON.stringify({
                message,
              }),
            })
              .then(async (res) => {
                setMessage(""); // Clear input on successful send
                if (res.ok) {
                  await res.json().then((data) => {
                    setError("");
                    setResponse(data.message);
                  });
                } else {
                  await res.json().then((data) => {
                    setError(data.error || "An unknown error occurred.");
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
  );
}