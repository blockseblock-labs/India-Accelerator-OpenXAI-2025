// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/router";
// import ChatBox from "../components/ChatBox";
// import { io, type Socket } from "socket.io-client";

// interface ChatMessage {
//   original: string;
//   translated: string;
//   fromLang: string;
//   toLang: string;
// }

// let socket: Socket | null = null;

// export default function Chat() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [text, setText] = useState("");
//   const [connected, setConnected] = useState(false);
//   const router = useRouter();
//   const { code, lang } = router.query as { code?: string; lang?: string };
//   const msgEnd = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!code || !lang) return;
//     socket = io("http://localhost:5000");

//     socket.on("connect", () => {
//       setConnected(true);
//       socket?.emit("joinRoom", { code, lang });
//     });

//     socket.on("message", (msg: ChatMessage) => {
//       setMessages((msgs) => [...msgs, msg]);
//       msgEnd.current?.scrollIntoView({ behavior: "smooth" });
//     });

//     return () => {
//       socket?.disconnect();
//       setConnected(false);
//     };
//   }, [code, lang]);

//   const sendMsg = () => {
//     if (!socket || !connected || !text.trim()) return;
//     const otherLang =
//       messages.length > 0
//         ? (messages[0].fromLang === lang
//             ? messages[0].toLang
//             : messages[0].fromLang)
//         : lang;

//     socket.emit("chatMessage", {
//       code,
//       text,
//       fromLang: lang,
//       toLang: otherLang
//     });

//     setText("");
//   };

//   if (!code || !lang) return <div style={{ padding: "20px" }}>Loading chat...</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ textAlign: "center" }}>Chat Room: <span style={{ color: "#3fb950" }}>{code}</span></h2>
//       <div
//         style={{
//           background: "#161b22",
//           borderRadius: "8px",
//           padding: "15px",
//           height: "60vh",
//           overflowY: "auto",
//           marginBottom: "20px"
//         }}
//       >
//         {messages.map((m, idx) => (
//           <ChatBox key={idx} original={m.original} translated={m.translated} />
//         ))}
//         <div ref={msgEnd} />
//       </div>
//       <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
//         <input
//           type="text"
//           value={text}
//           placeholder="Type your message"
//           onChange={(e) => setText(e.target.value)}
//           style={{ flex: 1, maxWidth: "400px" }}
//           disabled={!connected}
//         />
//         <button onClick={sendMsg} disabled={!connected}>Send</button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef, MouseEvent } from "react";
import { useRouter } from "next/router";
import ChatBox from "../components/ChatBox";
import { io, type Socket } from "socket.io-client";

interface ChatMessage {
  original: string;
  translated: string;
  fromLang: string;
  toLang: string;
}

let socket: Socket | null = null;

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const router = useRouter();
  const { code, lang } = router.query as { code?: string; lang?: string };
  const msgEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !lang) return;
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setConnected(true);
      socket?.emit("joinRoom", { code, lang });
    });

    socket.on("message", (msg: ChatMessage) => {
      setMessages((msgs) => [...msgs, msg]);
      msgEnd.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket?.disconnect();
      setConnected(false);
    };
  }, [code, lang]);

  const sendMsg = () => {
    if (!socket || !connected || !text.trim()) return;
    const otherLang =
      messages.length > 0
        ? (messages[0].fromLang === lang
            ? messages[0].toLang
            : messages[0].fromLang)
        : lang;

    socket.emit("chatMessage", {
      code,
      text,
      fromLang: lang,
      toLang: otherLang
    });

    setText("");
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "1.8rem",
    marginBottom: "15px",
    textAlign: "center",
  };

  const chatAreaStyle: React.CSSProperties = {
    background: "#111",
    borderRadius: "8px",
    padding: "15px",
    height: "60vh",
    width: "100%",
    maxWidth: "700px",
    overflowY: "auto",
    marginBottom: "20px",
    border: "1px solid #00ff7f",
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: "500px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #00ff7f",
    background: "#000",
    color: "#fff",
    fontSize: "1rem",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #00ff7f",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  };

  const handleHover = (e: MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.backgroundColor = "#00ff7f";
      e.currentTarget.style.color = "#000";
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 0 15px #00ff7f";
    } else {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#fff";
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  if (!code || !lang) {
    return (
      <div style={containerStyle}>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>
        Chat Room:{" "}
        <span style={{ color: "#00ff7f", fontWeight: "bold" }}>{code}</span>
      </h2>

      <div style={chatAreaStyle}>
        {messages.map((m, idx) => (
          <ChatBox
            key={idx}
            original={m.original}       // white
            translated={m.translated}   // green
          />
        ))}
        <div ref={msgEnd} />
      </div>

      <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "700px" }}>
        <input
          type="text"
          value={text}
          placeholder="Type your message"
          onChange={(e) => setText(e.target.value)}
          style={inputStyle}
          disabled={!connected}
        />
        <button
          style={buttonStyle}
          onMouseOver={(e) => handleHover(e, true)}
          onMouseOut={(e) => handleHover(e, false)}
          onClick={sendMsg}
          disabled={!connected}
        >
          Send
        </button>
      </div>
    </div>
  );
}
