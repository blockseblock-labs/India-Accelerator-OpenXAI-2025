import { Chat } from "@/components/chat";
import React from "react";
import "./page.css"; // we'll add styles here

export default function IndexPage() {
  return (
    <div className="page-wrapper">
      <header className="page-header">💬 My Chat App</header>
      <main className="page-content">
        <Chat />
      </main>
      <footer className="page-footer">Powered by Next.js</footer>
    </div>
  );
}
