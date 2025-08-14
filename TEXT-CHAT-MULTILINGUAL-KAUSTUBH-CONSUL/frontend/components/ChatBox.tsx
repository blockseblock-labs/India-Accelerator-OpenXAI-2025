// interface Props {
//   original: string;
//   translated: string;
// }

// export default function ChatBox({ original, translated }: Props) {
//   return (
//     <div style={{
//       padding: "10px",
//       marginBottom: "10px",
//       background: "#21262d",
//       borderRadius: "6px"
//     }}>
//       <div><strong>Original:</strong> {original}</div>
//       <div style={{ color: "#3fb950" }}><strong>Translated:</strong> {translated}</div>
//     </div>
//   );
// }


interface Props {
  original: string;
  translated: string;
}

export default function ChatBox({ original, translated }: Props) {
  return (
    <div
      style={{
        padding: "12px 16px",
        marginBottom: "12px",
        background: "#000",
        border: "1px solid #222",
        borderRadius: "10px",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "#00ff7f";
        e.currentTarget.style.boxShadow = "0 0 8px #00ff7f55";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "#222";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "4px" }}>
        Original:
      </div>
      <div style={{ color: "#fff", fontSize: "1rem", marginBottom: "8px" }}>
        {original}
      </div>

      <div style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "4px" }}>
        Translated:
      </div>
      <div style={{ color: "#00ff7f", fontSize: "1rem" }}>
        {translated}
      </div>
    </div>
  );
}
