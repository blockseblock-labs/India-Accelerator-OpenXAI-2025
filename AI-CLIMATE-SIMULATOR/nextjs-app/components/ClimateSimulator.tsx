"use client";

import { useState } from "react";

export default function ClimateSimulator() {
  const [emissions, setEmissions] = useState(50);
  const [temperature, setTemperature] = useState(1.2);

  const handleSimulation = () => {
    // Fake AI calculation
    setTemperature((emissions / 100) * 3);
  };

  return (
    <section id="simulator" className="py-16 px-8 text-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Climate Simulator</h2>
      <p className="mb-8">Adjust settings to see the effect on Earth 🌍</p>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
        <label className="block mb-4 text-left font-semibold">
          Carbon Emissions: {emissions}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={emissions}
          onChange={(e) => setEmissions(Number(e.target.value))}
          className="w-full mb-6"
        />

        <button
          onClick={handleSimulation}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
        >
          Run Simulation
        </button>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">
            🌡 Predicted Temperature Rise: {temperature.toFixed(2)} °C
          </h3>
        </div>
      </div>
    </section>
  );
}
