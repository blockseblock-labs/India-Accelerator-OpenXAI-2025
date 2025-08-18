import React, { useState } from "react";

// 🌍 Environment Metrics type
interface EnvironmentMetrics {
  temperature: number;   // in °C
  oceanPH: number;       // 0 - 14
  iceLevel: number;      // %
  pollution: number;     // ppm
  forestCover: number;   // %
}

// 🌍 Initial values
const initialMetrics: EnvironmentMetrics = {
  temperature: 30,
  oceanPH: 7.0,
  iceLevel: 100,
  pollution: 0,
  forestCover: 80,
};

// 🌍 Logic for handling commands
function applyCommand(command: string, current: EnvironmentMetrics): EnvironmentMetrics {
  const updated = { ...current };

  switch (command.toLowerCase()) {
    case "cut down the amazon rainforest":
      updated.forestCover = Math.max(0, current.forestCover - 20);
      updated.pollution += 50;
      updated.temperature += 2;
      break;

    case "build coal power plant":
      updated.pollution += 30;
      updated.temperature += 1;
      break;

    case "start nuclear war":
      updated.pollution += 200;
      updated.temperature += 5;
      updated.oceanPH -= 0.5;
      break;

    case "plant 1 million trees":
      updated.forestCover = Math.min(100, current.forestCover + 10);
      updated.pollution = Math.max(0, current.pollution - 20);
      updated.temperature -= 0.5;
      break;

    default:
      alert("Unknown command: " + command);
  }

  return updated;
}

// 🌍 Main App Component
const App: React.FC = () => {
  const [metrics, setMetrics] = useState<EnvironmentMetrics>(initialMetrics);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const updated = applyCommand(input, metrics);
    setMetrics(updated);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">🌍 Environment Earth Controller</h1>

      {/* Control Panel */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md text-white w-full max-w-xl mb-6">
        <h2 className="text-lg font-bold">🌍 Command Center</h2>
        <div className="flex gap-2 my-3">
          <input
            type="text"
            className="flex-1 p-2 rounded text-black"
            placeholder="Enter command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500"
          >
            Send
          </button>
        </div>

        <p className="text-xs text-gray-300">Example Commands:</p>
        <ul className="text-xs list-disc ml-4 text-gray-400">
          <li>Cut down the Amazon rainforest</li>
          <li>Build coal power plant</li>
          <li>Plant 1 million trees</li>
          <li>Start nuclear war</li>
        </ul>
      </div>

      {/* Metrics Panel */}
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-lg font-bold mb-3">📊 Environment Metrics</h2>
        <ul className="space-y-1 text-sm">
          <li>🌡 Temperature: {metrics.temperature.toFixed(2)} °C</li>
          <li>🌊 Ocean pH: {metrics.oceanPH.toFixed(2)}</li>
          <li>🧊 Ice Level: {metrics.iceLevel.toFixed(2)}%</li>
          <li>🏭 Pollution: {metrics.pollution.toFixed(2)} ppm</li>
          <li>🌲 Forest Cover: {metrics.forestCover.toFixed(2)}%</li>
        </ul>
      </div>
    </div>
  );
};

export default App;