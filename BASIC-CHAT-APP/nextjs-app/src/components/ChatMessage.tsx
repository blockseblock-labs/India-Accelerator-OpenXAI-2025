import React from 'react'
import { Message } from '@/types/chat'

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className="flex items-start space-x-2 max-w-[80%]">
        {!isUser && (
          <div className="w-8 h-8 bg-chat-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white font-semibold text-xs">L3</span>
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'message-user rounded-br-lg'
              : 'message-bot rounded-bl-lg'
          } shadow-sm`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-chat-text-muted'}`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        {isUser && (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white font-semibold text-xs">U</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
