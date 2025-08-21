'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type ChatMessage = {
  id: string;
  user: string;
  text: string;
  ts: string;  // ISO timestamp
};

export default function GroupChat() {
  const [name, setName] = useState<string>(() => `User-${Math.floor(Math.random()*1000)}`);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ensure socket is only created on client once
  const socket: Socket = useMemo(() => io('http://localhost:4000', { transports: ['websocket'] }), []);

  useEffect(() => {
    socket.on('connect', () => {
      // console.log('connected', socket.id);
    });

    socket.on('chat:message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing', (user: string) => {
      setTyping(user);
      const t = setTimeout(() => setTyping(null), 1500);
      return () => clearTimeout(t);
    });

    return () => {
      socket.off('chat:message');
      socket.off('typing');
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    // auto-scroll to bottom
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    socket.emit('chat:message', { user: name, text });
    setInput('');
  };

  return (
    <div style={{maxWidth: 720, margin: '24px auto', padding: 16, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'}}>
      <h2 style={{marginBottom: 8}}>👥 Group Chat (Realtime)</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }}
        />
      </div>

      <div ref={listRef} style={{height: 360, overflowY: 'auto', padding: 12, border: '1px solid #eee', borderRadius: 8, background: '#fafafa'}}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 10, display: 'flex', gap: 8 }}>
            <div style={{ fontWeight: 600 }}>{m.user}:</div>
            <div>{m.text}</div>
            <div style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }}>
              {new Date(m.ts).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {typing && <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{typing} is typing…</div>}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socket.emit('typing', name);
          }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message and press Enter"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff' }}>
          Send
        </button>
      </div>
    </div>
  );
}
