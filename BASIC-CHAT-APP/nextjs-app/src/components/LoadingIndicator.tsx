import React from 'react'

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex items-start space-x-2 max-w-[80%]">
        <div className="w-8 h-8 bg-chat-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white font-semibold text-xs">L3</span>
        </div>
        <div className="message-bot rounded-2xl rounded-bl-lg px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-chat-text-muted rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-chat-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-chat-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-chat-text-muted">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingIndicator
