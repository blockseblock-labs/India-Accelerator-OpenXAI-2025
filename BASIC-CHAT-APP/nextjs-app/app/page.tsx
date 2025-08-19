import { Chat } from "@/components/chat";
import React from "react";

export default function IndexPage() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      {/* Custom heading */}
      <h1 style={{ fontSize: "2.5rem", color: "#00e6e6", marginBottom: "20px" }}>
        🚀 Welcome to My Custom Chat App
      </h1>

      {/* Small description */}
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        This is an AI-powered chat app — with my customized UI!
      </p>

      {/* The actual Chat UI */}
      <div
        style={{
          margin: "0 auto",
          maxWidth: "800px",
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <Chat />
      </div>

      {/* Footer note */}
      <p style={{ marginTop: "40px", fontStyle: "italic" }}>
        ✨ UI customized by Jai for Internship Mini Task ✨
      </p>
    </div>
  );
}
#latest 