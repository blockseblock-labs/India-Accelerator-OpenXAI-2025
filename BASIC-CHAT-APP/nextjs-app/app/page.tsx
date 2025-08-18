'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Trash2, Send, Sun, Moon } from 'lucide-react';

type Msg = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: number;
};

const MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3';

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (typeof window !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')) || 'light'
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  // Theme persistence + <html class="dark">
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Load/save chat history
  useEffect(() => {
    const raw = localStorage.getItem('chat_history');
    if (raw) setMessages(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSend = input.trim().length > 0 && !thinking;

  async function send() {
    if (!canSend) return;
    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      ts: Date.now(),
    };
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);
    try {
      // Build payload expected by our /api/chat route (and Ollama /api/chat)
      const payload = {
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
      };
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const replyText =
        data?.message?.content ??
        data?.content ??
        'Sorry, I could not generate a response. Please check OLLAMA_HOST / model.';

      const aiMsg: Msg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: replyText,
        ts: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      const aiMsg: Msg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${String(e)}`,
        ts: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setThinking(false);
    }
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem('chat_history');
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  const header = useMemo(
    () => (
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">OpenXAI Chat</span>
          <span className="text-xs rounded-full px-2 py-1 border ml-2 border-neutral-300 dark:border-neutral-700">
            Model: {MODEL}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
            className="rounded-lg px-2 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={clearChat}
            className="rounded-lg px-2 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    ),
    [theme]
  );

  return (
    <main className="min-h-screen flex flex-col bg-white text-black dark:bg-neutral-950 dark:text-neutral-100">
      {header}

      <div className="flex-1 w-full max-w-3xl mx-auto px-3 py-4">
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border
                  ${m.role === 'user'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-inherit'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                  <span>{new Date(m.ts).toLocaleTimeString()}</span>
                  <button onClick={() => copy(m.content)} className="flex items-center gap-1 hover:opacity-100 opacity-80">
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 border bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <span className="inline-flex items-center gap-2">
                  <span className="font-medium">AI is typing</span>
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '120ms' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '240ms' }}>.</span>
                  </span>
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-3 pb-5">
        <div className="border rounded-2xl border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask anything..."
            rows={3}
            className="w-full p-3 outline-none resize-none bg-transparent"
          />
          <div className="p-2 flex justify-end">
            <button
              disabled={!canSend}
              onClick={send}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 transition
                ${canSend
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-neutral-300 text-neutral-600 cursor-not-allowed'}`}
            >
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
