"use client";

import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px', 
        padding: '20px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>AI Chat Assistant</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>Ask me anything!</p>
      </div>

      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ddd', 
        borderRadius: '10px', 
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#fff'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👋</div>
            <p>Start a conversation with the AI assistant</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '15px',
            textAlign: msg.sender === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '18px',
              maxWidth: '70%',
              backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9ecef',
              color: msg.sender === 'user' ? '#fff' : '#333',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <div>{msg.text}</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.7, 
                marginTop: '5px' 
              }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '18px',
              backgroundColor: '#e9ecef',
              color: '#666'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  marginRight: '4px',
                  animation: 'bounce 1s infinite'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  marginRight: '4px',
                  animation: 'bounce 1s infinite',
                  animationDelay: '0.1s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  animation: 'bounce 1s infinite',
                  animationDelay: '0.2s'
                }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '25px',
            outline: 'none',
            fontSize: '16px'
          }}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
