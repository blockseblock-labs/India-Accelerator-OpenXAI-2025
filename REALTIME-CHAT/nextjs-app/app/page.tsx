'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, CheckCheck, MoreVertical, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Header for the conversation, now specifically for the AI Assistant
const ConversationHeader = () => (
  <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 shadow-sm">
    <div className="flex items-center gap-3">
      <ArrowLeft size={20} className="cursor-pointer text-gray-600 md:hidden" />
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-color)] text-white">
        <Bot size={22} />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-gray-800">AI Assistant</p>
        <p className="text-xs text-green-500">online</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <MoreVertical size={20} className="cursor-pointer text-gray-600" />
    </div>
  </header>
);

// --- MAIN CHAT COMPONENT ---

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { role: 'assistant', content: 'Hello! How can I help you today?', timestamp: getCurrentTime() }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getCurrentTime = () => new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input, timestamp: getCurrentTime() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) throw new Error('Failed to get response');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: getCurrentTime() }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          const parsed = JSON.parse(line);
          if (parsed.message && parsed.message.content) {
            assistantResponse += parsed.message.content;
            setMessages(prev => {
              const updatedMessages = [...prev];
              const lastMsg = updatedMessages[updatedMessages.length - 1];
              lastMsg.content = assistantResponse;
              lastMsg.timestamp = getCurrentTime();
              return updatedMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Sorry, an error occurred.', timestamp: getCurrentTime() };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // The main container now has h-full to fit within the new layout
    <div className="mx-auto flex h-full max-w-4xl flex-col border-x bg-white">
      <ConversationHeader />

      <main className="flex-1 overflow-y-auto bg-[var(--bg-color)] p-4 sm:p-6">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 150 }}
                className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`w-fit max-w-lg rounded-xl px-3 py-2 shadow-sm ${message.role === 'user' ? 'rounded-br-none bg-[var(--user-bubble)]' : 'rounded-bl-none bg-[var(--assistant-bubble)]'}`}>
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content || '...'}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <p className="text-xs text-gray-400">{message.timestamp}</p>
                    {message.role === 'user' && <CheckCheck size={16} className="text-blue-500" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="shrink-0 border-t bg-gray-100 p-2 sm:p-4">
        <div className="flex items-center gap-2">
          <TextareaAutosize
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Message"
            className="flex-1 resize-none rounded-full border-gray-300 bg-white px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            minRows={1} maxRows={5} disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-color)] text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}