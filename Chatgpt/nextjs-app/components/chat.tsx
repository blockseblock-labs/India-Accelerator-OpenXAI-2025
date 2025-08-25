"use client";

import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      {error && <span style={{ color: "red" }}>{error}</span>}
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
  );
}
