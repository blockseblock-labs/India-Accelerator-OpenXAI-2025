"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[70vh]">
      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet. Start chatting! 🚀</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-lg max-w-xs ${
                index % 2 === 0
                  ? "bg-indigo-500 text-white self-start"
                  : "bg-gray-300 text-black self-end"
              }`}
            >
              {msg}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l-lg px-3 py-2 outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}