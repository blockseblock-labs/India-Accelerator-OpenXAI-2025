// src/components/ChatBox.jsx
import { useState } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        { message: userMessage },
        { withCredentials: true }
      );
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.bot }]);
    } catch (err) {
      console.error('Error sending message:', err.message);
      setMessages(prev => [...prev, { sender: 'bot', text: "I couldn't respond" }]);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 flex flex-col">
      <div className="flex-1 overflow-auto h-96 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 rounded-r" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
