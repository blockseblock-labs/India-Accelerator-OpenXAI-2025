"use client";
import Editor from "@monaco-editor/react";
import { Dispatch, SetStateAction, ChangeEvent } from "react";

interface CodeEditorProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export default function CodeEditor({ code, setCode }: CodeEditorProps) {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white/10 border border-gray-700 rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold">Enter your code:</label>
        <input
          type="file"
          accept=".js,.ts,.py,.java,.cpp,.c,.cs,.rb,.go,.php,.rs,.swift,.kt,.scala,.sh,.json"
          onChange={handleFileUpload}
          className="text-sm text-gray-300"
          title="Upload code file"
        />
      </div>
      <Editor
        height="400px"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          scrollbar: { vertical: "auto", horizontal: "auto" },
        }}
      />
    </div>
  );
}
