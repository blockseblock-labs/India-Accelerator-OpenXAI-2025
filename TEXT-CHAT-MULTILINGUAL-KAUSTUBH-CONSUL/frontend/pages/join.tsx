// import { useState } from "react";
// import { useRouter } from "next/router";

// export default function Join() {
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   async function joinRoom() {
//     const res = await fetch("http://localhost:5000/join-room", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ code })
//     });

//     if (res.ok) {
//       const data = await res.json();
//       const receiverLang = data.languages[1]; // joiner uses receiver's language set by creator
//       router.push(`/chat?code=${code}&lang=${receiverLang}`);
//     } else {
//       setError("Room not found!");
//     }
//   }

//   return (
//     <div style={{ textAlign: "center", paddingTop: "50px" }}>
//       <h2>Join Chat Room</h2>
//       <input
//         type="text"
//         value={code}
//         placeholder="Enter Room Code"
//         onChange={(e) => setCode(e.target.value)}
//       />
//       <div style={{ marginTop: "20px" }}>
//         <button onClick={joinRoom} disabled={!code.trim()}>
//           Join
//         </button>
//       </div>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }


import { useState } from "react";
import { useRouter } from "next/router";

export default function Join() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function joinRoom() {
    const res = await fetch("http://localhost:5000/join-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (res.ok) {
      const data = await res.json();
      const receiverLang = data.languages[1];
      router.push(`/chat?code=${code}&lang=${receiverLang}`);
    } else {
      setError("Room not found!");
    }
  }

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Join Chat Room</h2>

      <input
        type="text"
        value={code}
        placeholder="Enter Room Code"
        onChange={(e) => setCode(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "6px",
          border: "1px solid #222",
          background: "#111",
          color: "#fff",
          fontSize: "1rem",
          outline: "none",
          width: "250px",
          textAlign: "center",
          marginBottom: "20px"
        }}
      />

      <button
        onClick={joinRoom}
        disabled={!code.trim()}
        style={{
          padding: "10px 20px",
          borderRadius: "6px",
          border: "1px solid #00ff7f",
          background: "#000",
          color: "#00ff7f",
          cursor: code.trim() ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          if (code.trim()) {
            e.currentTarget.style.background = "#00ff7f";
            e.currentTarget.style.color = "#000";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#000";
          e.currentTarget.style.color = "#00ff7f";
        }}
      >
        Join
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}
