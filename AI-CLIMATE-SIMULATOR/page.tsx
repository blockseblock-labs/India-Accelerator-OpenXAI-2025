// app/simulator/page.tsx
"use client";

import React, { useState } from "react";

export default function SimulatorPage() {
  const [temperature, setTemperature] = useState(0);

  const runSimulation = () => {
    // Step 4 logic here (AI Climate Simulator code)
    console.log("Running simulation with temp:", temperature);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">AI Climate Simulator</h1>
      <input
        type="number"
        value={temperature}
        onChange={(e) => setTemperature(Number(e.target.value))}
        className="border p-2 mr-2"
        placeholder="Temperature"
      />
      <button
        onClick={runSimulation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run Simulation
      </button>
    </div>
  );
}