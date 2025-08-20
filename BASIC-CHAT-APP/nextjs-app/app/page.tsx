"use client";

import { useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    alert(`You typed: ${message}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>🤖 Welcome to ChatSphere</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          A chat experience designed for speed, simplicity, and smart interactions.
      </p>

      {/* Text Box */}
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          padding: "10px 15px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          width: "300px",
          marginBottom: "15px",
          fontSize: "1rem",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          color: "black",
        }}
      />

      {/* Button */}
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          backgroundColor: "#ff7eb3",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff4f81")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff7eb3")}
      >
        Send 🚀
      </button>
    </div>
  );
}
