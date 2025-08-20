"use client";

import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6 text-center">Basic Chat App</h1>
      {error && <span className="error">{error}</span>}
      <span className="response">{response}</span>
      <form
        className="flex items-center mt-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setMessage("");
          fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ message }),
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
        <input
          className="flex-1"
          disabled={loading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
