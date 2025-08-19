// "use client";

// import { useState } from "react";

// export function Chat() {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState("");
//   const [error, setError] = useState("");

//   return (
//     <div>
//       {error && <span style={{ color: "red" }}>{error}</span>}
//       <span>{response}</span>
//       <div>
//         <input
//           disabled={loading}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           disabled={loading}
//           onClick={() => {
//             setLoading(true);
//             setMessage("");
//             fetch("/api/chat", {
//               method: "POST",
//               body: JSON.stringify({
//                 message,
//               }),
//             })
//               .then(async (res) => {
//                 if (res.ok) {
//                   await res.json().then((data) => {
//                     setError("");
//                     setResponse(data.message);
//                   });
//                 } else {
//                   await res.json().then((data) => {
//                     setError(data.error);
//                     setResponse("");
//                   });
//                 }
//               })
//               .finally(() => setLoading(false));
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import "./Chat.css"; // Import CSS file

// export function Chat() {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState("");
//   const [error, setError] = useState("");

//   return (
//     <div className="chat-container">
//       <div className="chat-box">
//         {error && <span className="error-text">{error}</span>}
//         <div className="response">{response}</div>
//         <div className="input-area">
//           <input
//             className="chat-input"
//             disabled={loading}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type your message..."
//           />
//           <button
//             className="chat-button"
//             disabled={loading}
//             onClick={() => {
//               setLoading(true);
//               setMessage("");
//               fetch("/api/chat", {
//                 method: "POST",
//                 body: JSON.stringify({ message }),
//               })
//                 .then(async (res) => {
//                   if (res.ok) {
//                     await res.json().then((data) => {
//                       setError("");
//                       setResponse(data.message);
//                     });
//                   } else {
//                     await res.json().then((data) => {
//                       setError(data.error);
//                       setResponse("");
//                     });
//                   }
//                 })
//                 .finally(() => setLoading(false));
//             }}
//           >
//             {loading ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import "./Chat.css"; // Import CSS file

export function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!message.trim()) return; // Don't send empty messages

    setLoading(true);
    const currentMessage = message;
    setMessage(""); // Clear input field immediately

    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: currentMessage }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setError("");
          setResponse(data.message);
        } else {
          const data = await res.json();
          setError(data.error);
          setResponse("");
        }
      })
      .catch(() => {
        setError("Failed to connect to the server. Please try again.");
        setResponse("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Allow sending with the Enter key
  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1 className="chat-title">AJaX</h1>
        <p className="welcome-message">
          Welcome Atharva! Ask anything you want to explore
        </p>
        
        {/* This div will hold the messages and will be scrollable */}
        <div className="messages-area">
          {error && <div className="error-text">{error}</div>}
          {response && <div className="response-text">{response}</div>}
        </div>

        <div className="input-area">
          <input
            className="chat-input"
            disabled={loading}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button
            className="chat-button"
            disabled={loading || !message.trim()}
            onClick={handleSend}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}