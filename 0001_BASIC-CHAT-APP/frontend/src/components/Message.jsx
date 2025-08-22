const Message = ({ sender, text, darkMode, timestamp }) => {
  const isUser = sender === 'user';

  // Avatars
  const avatar = isUser
    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png'
    : 'https://png.pngtree.com/png-vector/20220707/ourmid/pngtree-chatbot-robot-concept-chat-bot-png-image_5632381.png';

  // Format timestamp
  const timeString = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`mb-4 flex items-start ${isUser ? 'justify-end' : 'justify-start'} relative`}>
      
      {/* Glow / Hover Effect Behind Bubble */}
      <div
        className={`
          absolute -inset-1 rounded-xl
          ${isUser
            ? 'bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300 opacity-0 group-hover:opacity-40'
            : 'bg-gradient-to-r from-green-400 via-blue-400 to-indigo-500 opacity-0 group-hover:opacity-40'
          }
          blur-2xl pointer-events-none transition-opacity duration-300
        `}
      />

      {/* Bot Avatar */}
      {!isUser && (
        <img
          src={avatar}
          alt="bot-avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
      )}

      {/* Message Bubble */}
      <div className="group relative flex flex-col">
        <div
          className={`
            max-w-xs px-5 py-3 rounded-2xl break-words relative z-10 shadow-md
            ${isUser
              ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}`
              : `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-900'}`
            }
          `}
        >
          {text}
        </div>
        {/* Timestamp */}
        {timeString && (
          <span className={`text-xs mt-1 ${isUser ? 'text-gray-300 text-right' : 'text-gray-500 text-left'}`}>
            {timeString}
          </span>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <img
          src={avatar}
          alt="user-avatar"
          className="w-10 h-10 rounded-full ml-3"
        />
      )}
    </div>
  );
};

export default Message;
