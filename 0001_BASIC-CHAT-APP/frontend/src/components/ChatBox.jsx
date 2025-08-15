// src/components/ChatBox.jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';

const ChatBox = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        { message: userMessage },
        { withCredentials: true }
      );
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.bot, timestamp: new Date() }]);
    } catch (err) {
      console.error('Error sending message:', err.message);
      setMessages(prev => [...prev, { sender: 'bot', text: "I couldn't respond", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, loading]);

  return (
    <div
      className={`
        w-full max-w-3xl flex flex-col p-5 rounded-2xl shadow-xl transition-colors duration-500
        relative
        ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-300 before:via-pink-200 before:to-yellow-200 before:opacity-10 before:rounded-2xl before:pointer-events-none
        hover:before:opacity-20
      `}
    >
      {/* Chat messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden mb-4 px-2 py-1 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300"
      >
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            sender={msg.sender}
            text={msg.text}
            darkMode={darkMode}
            timestamp={msg.timestamp}
          />
        ))}

        {loading && (
          <div className={`italic ${darkMode ? 'text-gray-300' : 'text-gray-500'} mt-2`}>
            Bot is typing...
          </div>
        )}
      </div>

      {/* Input field */}
      <div className="flex mt-2">
        <input
          className={`
            flex-1 px-4 py-3 rounded-l-2xl border-none focus:outline-none
            ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-200 text-gray-900 placeholder-gray-500'}
          `}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-2xl transition-colors duration-200"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
