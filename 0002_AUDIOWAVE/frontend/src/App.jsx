import React from "react";
import AudioRecorder from "./components/AudioRecorder.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-600">
      <div className="mx-auto max-w-4xl p-6">
        <AudioRecorder />
      </div>
    </div>
  );
}
