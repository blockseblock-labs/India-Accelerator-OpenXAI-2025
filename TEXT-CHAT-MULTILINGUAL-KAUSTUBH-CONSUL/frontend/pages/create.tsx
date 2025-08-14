// import { useState } from "react";
// import { useRouter } from "next/router";
// import LanguageDropdown from "../components/LanguageDropdown";

// export default function Create() {
//   const [userLang, setUserLang] = useState("");
//   const [receiverLang, setReceiverLang] = useState("");
//   const [code, setCode] = useState("");
//   const router = useRouter();

//   async function createRoom() {
//     const res = await fetch("http://localhost:5000/create-room", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userLang, otherLang: receiverLang })
//     });
//     const data = await res.json();
//     setCode(data.code);
//   }

//   return (
//     <div style={{ textAlign: "center", paddingTop: "50px" }}>
//       <h2>Create Chat Room</h2>
//       <p>Your Language</p>
//       <LanguageDropdown value={userLang} onChange={setUserLang} />
//       <p>Receiver's Language</p>
//       <LanguageDropdown value={receiverLang} onChange={setReceiverLang} />
//       <div style={{ marginTop: "20px" }}>
//         <button onClick={createRoom} disabled={!userLang || !receiverLang}>
//           Create
//         </button>
//       </div>
//       {code && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Room Code: <span style={{ color: "#3fb950" }}>{code}</span></h3>
//           <button
//             onClick={() => router.push(`/chat?code=${code}&lang=${userLang}`)}
//           >
//             Go to Chat
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import LanguageDropdown from "../components/LanguageDropdown";

export default function Create() {
  const [userLang, setUserLang] = useState<string>("");
  const [receiverLang, setReceiverLang] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const router = useRouter();

  async function createRoom() {
    const res = await fetch("http://localhost:5000/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userLang, otherLang: receiverLang })
    });
    const data = await res.json();
    setCode(data.code);
  }

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    marginBottom: "20px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  };

  const labelStyle: React.CSSProperties = {
    marginTop: "20px",
    fontSize: "1.2rem",
    color: "#fff",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #00ff7f",
    padding: "12px 25px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    marginTop: "20px",
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

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Chat Room</h2>

      <p style={labelStyle}>Your Language</p>
      <LanguageDropdown value={userLang} onChange={setUserLang} />

      <p style={labelStyle}>Receiver's Language</p>
      <LanguageDropdown value={receiverLang} onChange={setReceiverLang} />

      <div>
        <button
          style={buttonStyle}
          onMouseOver={(e) => handleHover(e, true)}
          onMouseOut={(e) => handleHover(e, false)}
          onClick={createRoom}
          disabled={!userLang || !receiverLang}
        >
          Create
        </button>
      </div>

      {code && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h3>
            Room Code:{" "}
            <span style={{ color: "#00ff7f", fontWeight: "bold" }}>{code}</span>
          </h3>
          <button
            style={buttonStyle}
            onMouseOver={(e) => handleHover(e, true)}
            onMouseOut={(e) => handleHover(e, false)}
            onClick={() => router.push(`/chat?code=${code}&lang=${userLang}`)}
          >
            Go to Chat
          </button>
        </div>
      )}
    </div>
  );
}

