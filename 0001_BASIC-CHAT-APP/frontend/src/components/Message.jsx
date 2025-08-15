const Message = ({ sender, text }) => {
  const isUser = sender === 'user';

  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-xs px-4 py-2 rounded-lg 
          ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
          break-words
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
