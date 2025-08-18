import React, { useState } from "react";

interface EarthState {
  temperature: number;
  oceanPH: number;
  iceLevel: number;
  pollution: number;
  forestCover: number;
  freshwater: number;
  airQuality: number;
  renewableUsage: number;
}

const App: React.FC = () => {
  const [earth, setEarth] = useState<EarthState>({
    temperature: 15,
    oceanPH: 8.1,
    iceLevel: 100,
    pollution: 50,
    forestCover: 70,
    freshwater: 80,
    airQuality: 60,
    renewableUsage: 10,
  });

  const [policies, setPolicies] = useState({
    renewableEnergy: false,
    deforestation: false,
    oceanCleanup: false,
    industrialRegulation: false,
    waterConservation: false,
    reforestation: false,
  });

  const togglePolicy = (policy: keyof typeof policies) => {
    setPolicies((prev) => {
      const updated = { ...prev, [policy]: !prev[policy] };

      setEarth((prevEarth) => {
        let newEarth = { ...prevEarth };

        if (policy === "renewableEnergy") {
          newEarth.pollution += updated[policy] ? -30 : 30;
          newEarth.temperature += updated[policy] ? -2 : 2;
          newEarth.renewableUsage += updated[policy] ? 20 : -20;
          newEarth.airQuality += updated[policy] ? 15 : -15;
        }
        if (policy === "deforestation") {
          newEarth.pollution += updated[policy] ? 40 : -40;
          newEarth.iceLevel += updated[policy] ? -10 : 10;
          newEarth.forestCover += updated[policy] ? -20 : 20;
          newEarth.airQuality += updated[policy] ? -20 : 20;
        }
        if (policy === "oceanCleanup") {
          newEarth.oceanPH += updated[policy] ? 0.3 : -0.3;
          newEarth.pollution += updated[policy] ? -20 : 20;
          newEarth.freshwater += updated[policy] ? 10 : -10;
        }
        if (policy === "industrialRegulation") {
          newEarth.pollution += updated[policy] ? -40 : 40;
          newEarth.temperature += updated[policy] ? -1 : 1;
          newEarth.airQuality += updated[policy] ? 10 : -10;
        }
        if (policy === "waterConservation") {
          newEarth.freshwater += updated[policy] ? 20 : -20;
          newEarth.pollution += updated[policy] ? -10 : 10;
        }
        if (policy === "reforestation") {
          newEarth.forestCover += updated[policy] ? 25 : -25;
          newEarth.airQuality += updated[policy] ? 15 : -15;
          newEarth.temperature += updated[policy] ? -1 : 1;
        }

        return {
          ...newEarth,
          pollution: Math.max(0, newEarth.pollution),
          iceLevel: Math.min(100, Math.max(0, newEarth.iceLevel)),
          forestCover: Math.min(100, Math.max(0, newEarth.forestCover)),
          freshwater: Math.min(100, Math.max(0, newEarth.freshwater)),
          renewableUsage: Math.min(100, Math.max(0, newEarth.renewableUsage)),
          airQuality: Math.min(200, Math.max(0, newEarth.airQuality)),
        };
      });

      return updated;
    });
  };

  const getStatus = () => {
    if (
      earth.temperature > 25 ||
      earth.pollution > 150 ||
      earth.iceLevel < 40 ||
      earth.forestCover < 30 ||
      earth.freshwater < 40
    ) {
      return "⚠️ Critical – Earth is in danger!";
    } else if (
      earth.temperature > 20 ||
      earth.pollution > 100 ||
      earth.airQuality > 120
    ) {
      return "⚡ Warning – Conditions worsening.";
    } else {
      return "✅ Stable – Earth is in good condition.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-900 to-blue-900 text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">🌍 Advanced Earth Policy Controller</h1>

      {/* Policies Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {Object.entries(policies).map(([key, value]) => (
          <div
            key={key}
            className="bg-gray-800 p-3 rounded-xl shadow-md flex justify-between items-center"
          >
            <span className="capitalize font-medium text-sm">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={() => togglePolicy(key as keyof typeof policies)}
              />
              <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Earth Metrics */}
      <div className="mt-8 bg-black/40 p-4 rounded-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-3">📊 Earth Metrics</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>🌡️ Temperature: {earth.temperature.toFixed(1)} °C</li>
          <li>🌊 Ocean pH: {earth.oceanPH.toFixed(2)}</li>
          <li>🧊 Ice Level: {earth.iceLevel.toFixed(1)}%</li>
          <li>🏭 Pollution: {earth.pollution.toFixed(1)} ppm</li>
          <li>🌳 Forest Cover: {earth.forestCover.toFixed(1)}%</li>
          <li>💧 Freshwater: {earth.freshwater.toFixed(1)}%</li>
          <li>🌬️ Air Quality Index: {earth.airQuality.toFixed(1)}</li>
          <li>☀️ Renewable Usage: {earth.renewableUsage.toFixed(1)}%</li>
        </ul>
      </div>

      {/* Earth Status */}
      <div className="mt-5 bg-gray-900 p-4 rounded-xl shadow-md w-full max-w-lg text-center">
        <h2 className="text-lg font-bold mb-2">🌐 Earth Status</h2>
        <p className="text-base">{getStatus()}</p>
      </div>
    </div>
  );
};

export default App;
