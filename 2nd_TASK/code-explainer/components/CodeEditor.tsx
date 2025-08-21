// components/CodeEditor.tsx
"use client";
import Editor from "@monaco-editor/react";
import { Dispatch, SetStateAction } from "react";

interface CodeEditorProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export default function CodeEditor({ code, setCode }: CodeEditorProps) {
  return (
    <div className="bg-white/10 border border-gray-700 rounded-xl shadow-md p-4">
      <label className="block mb-2 font-semibold">Enter your code:</label>
      <Editor
        height="400px"                 // ✅ fixed height
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          scrollbar: { vertical: "auto", horizontal: "auto" }, // ✅ show scrollbars when needed
        }}
      />
    </div>
  );
}
