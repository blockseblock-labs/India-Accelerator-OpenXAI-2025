import { Chat } from "@/components/chat";
import React from "react";

export default function IndexPage() {
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="title">Chat</h1>
        <span className="muted">Next.js + Ollama on OpenXAI</span>
      </div>
      <Chat />
    </div>
  );
}
