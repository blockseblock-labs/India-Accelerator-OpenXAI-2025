// import { useRouter } from "next/router";

// export default function Home() {
//   const router = useRouter();
//   return (
//     <div style={{ background: "#000", color: "#fff", height: "100vh", display: "flex",
//       flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//       <h1>Multilingual Chatbot</h1>
//       <div>
//         <button
//           style={{ margin: "20px", padding: "20px", background: "#111", color: "#fff", border: "1px solid #444", cursor: "pointer" }}
//           onClick={() => router.push("/join")}
//         >Join a Chat</button>
//         <button
//           style={{ margin: "20px", padding: "20px", background: "#111", color: "#fff", border: "1px solid #444", cursor: "pointer" }}
//           onClick={() => router.push("/create")}
//         >Create a Chat</button>
//       </div>
//     </div>
//   );
// }


import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const containerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    textAlign: "center" as const,
  };

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "40px",
    textTransform: "uppercase" as const,
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #00ff7f",
    padding: "15px 30px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: "8px",
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#00ff7f";
    e.currentTarget.style.color = "#000";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 15px #00ff7f";
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Multilingual Chatbot</h1>
      <div style={buttonGroupStyle}>
        <button
          style={buttonStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={() => router.push("/join")}
        >
          Join a Chat
        </button>
        <button
          style={buttonStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={() => router.push("/create")}
        >
          Create a Chat
        </button>
      </div>
    </div>
  );
}
