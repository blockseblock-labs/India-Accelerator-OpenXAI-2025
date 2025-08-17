interface MessageBubbleProps {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
}

export function MessageBubble({ content, role, timestamp, isTyping = false }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 ${
          isUser
            ? "bg-primary text-primary-foreground neon-glow border border-primary/50"
            : "cyber-bg text-secondary-foreground neon-glow border border-secondary/50"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce neon-glow"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce neon-glow" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce neon-glow" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm font-medium">AI is processing...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{content}</p>
        )}
      </div>
    </div>
  );
} 