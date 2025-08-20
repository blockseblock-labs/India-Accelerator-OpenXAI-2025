// In app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Plus } from "lucide-react"; // Mic and StopCircle icons removed
import styles from "./HomePage.module.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string = prompt) => {
    if (!text.trim()) return;

    const userMessage: Message = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt("");

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3", // 👈 CHANGE THIS to your model name
          prompt: text,
          stream: true,
        }),
      });

      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      
      setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const jsonResponses = chunk.split('\n').filter(Boolean);

        for (const jsonResponse of jsonResponses) {
          try {
            const parsed = JSON.parse(jsonResponse);
            fullResponse += parsed.response || "";
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].text = fullResponse;
              return newMessages;
            });
          } catch (e) { console.error("Failed to parse JSON chunk:", jsonResponse); }
        }
      }
    } catch (error) {
      console.error("Error fetching from Ollama:", error);
      const errorMessage: Message = {
        text: "Sorry, I couldn't connect to the model. Please make sure Ollama is running.",
        sender: "bot",
      };
      setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={`${styles.contentWrapper} ${hasMessages ? styles.hasMessages : ''}`}>
          {hasMessages ? (
            <div className={styles.chatHistory}>
              {messages.map((msg, index) => (
                <div key={index} className={styles.messageRow}>
                  <div className={`${styles.avatar} ${msg.sender === 'user' ? styles.userAvatar : styles.botAvatar}`}>
                    {msg.sender === "user" ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <p className={styles.messageText}>{msg.text}</p>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                  <div className={styles.messageRow}>
                   <div className={`${styles.avatar} ${styles.botAvatar}`}>
                    <Bot size={20} />
                   </div>
                   <p className={styles.messageText}>Thinking...</p>
                 </div>
               )}
              <div ref={chatEndRef} />
            </div>
          ) : (
            <div className={styles.welcomeScreen}>
              <h1 className={styles.welcomeTitle}>What can I help with?</h1>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className={styles.inputForm}
        >
          <div className={styles.plusIcon}>
            <Plus size={20} />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything"
            className={styles.textInput}
            disabled={isLoading}
          />
          <div className={styles.inputIcons}>
            {prompt.trim() && !isLoading && (
              <button type="submit" className={styles.inputIcon} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}>
                <Send size={20} />
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
