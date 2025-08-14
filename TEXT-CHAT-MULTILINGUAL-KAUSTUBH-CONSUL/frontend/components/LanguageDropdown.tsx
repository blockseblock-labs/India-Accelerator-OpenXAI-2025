// import React from "react";
// const languages = [
//   { label: "English", value: "English" },
//   { label: "Hindi", value: "Hindi" },
//   { label: "French", value: "French" },
//   { label: "German", value: "German" },
//   { label: "Spanish", value: "Spanish" },
//   { label: "Italian", value: "Italian" },
//   { label: "Chinese", value: "Chinese" },
//   { label: "Japanese", value: "Japanese" },
//   { label: "Russian", value: "Russian" },
//   { label: "Arabic", value: "Arabic" },
//   { label: "Portuguese", value: "Portuguese" },
//   { label: "Bengali", value: "Bengali" },
//   { label: "Tamil", value: "Tamil" },
//   { label: "Telugu", value: "Telugu" }
// ];
// interface Props {
//   value: string;
//   onChange: (val: string) => void;
// }
// export default function LanguageDropdown({ value, onChange }: Props) {
//   return (
//     <select
//       value={value}
//       style={{ padding: "10px", margin: "10px", background: "#222", color: "#fff", border: "1px solid #444" }}
//       onChange={e => onChange(e.target.value)}
//     >
//       <option value="">Select Language</option>
//       {languages.map(lang => (
//         <option key={lang.value} value={lang.value}>{lang.label}</option>
//       ))}
//     </select>
//   );
// }


import React from "react";

const languages = [
  { label: "English", value: "English" },
  { label: "Hindi", value: "Hindi" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Italian", value: "Italian" },
  { label: "Chinese", value: "Chinese" },
  { label: "Japanese", value: "Japanese" },
  { label: "Russian", value: "Russian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Bengali", value: "Bengali" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" }
];

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function LanguageDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px 15px",
        margin: "10px",
        background: "#000",
        color: "#fff",
        border: "2px solid #00ff7f",
        borderRadius: "6px",
        fontSize: "1rem",
        outline: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = "0 0 12px #00ff7f";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "#00ff7f";
        e.currentTarget.style.boxShadow = "0 0 8px #00ff7f";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "#00ff7f";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <option value="">Select Language</option>
      {languages.map((lang) => (
        <option
          key={lang.value}
          value={lang.value}
          style={{ background: "#000", color: "#fff" }}
        >
          {lang.label}
        </option>
      ))}
    </select>
  );
}
