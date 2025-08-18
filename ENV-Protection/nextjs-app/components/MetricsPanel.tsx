import React, { useState } from "react";

interface EarthData {
  temperature: number;
  oceanPH: number;
  iceLevel: number;
  pollution: number;
  deforestation: boolean;
  renewableEnergy: boolean;
  wildlifeProtection: boolean;
}

const App: React.FC = () => {
  const [earth, setEarth] = useState<EarthData>({
    temperature: 15,
    oceanPH: 8.1,
    iceLevel: 100,
    pollution: 50,
    deforestation: false,
    renewableEnergy: true,
    wildlifeProtection: false,
  });

  const changeMetric = (key: keyof EarthData, delta: number) => {
    setEarth((prev) => {
      let updated = { ...prev };
      if (typeof prev[key] === "number") {
        updated[key] = Math.max(
          key === "oceanPH" ? 7.5 : 0,
          key === "oceanPH" ? Math.min(8.5, (prev[key] as number) + delta) : (prev[key] as number) + delta
        ) as any;
      }
      return updated;
    });
  };

  const toggleMetric = (key: keyof EarthData) => {
    setEarth((prev) => ({
      ...prev,
      [key]: !(prev[key] as boolean),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-900 to-blue-900 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌍 Earth Environment Controller</h1>

      {/* Controls Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Temperature */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="font-bold">🌡 Temperature: {earth.temperature.toFixed(1)} °C</h2>
          <div className="flex gap-2 mt-2">
            <button onClick={() => changeMetric("temperature", +1)} className="bg-red-500 px-3 py-1 rounded">+1</button>
            <button onClick={() => changeMetric("temperature", -1)} className="bg-blue-500 px-3 py-1 rounded">-1</button>
          </div>
        </div>

        {/* Ocean PH */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="font-bold">🌊 Ocean pH: {earth.oceanPH.toFixed(2)}</h2>
          <div className="flex gap-2 mt-2">
            <button onClick={() => changeMetric("oceanPH", +0.1)} className="bg-green-600 px-3 py-1 rounded">+0.1</button>
            <button onClick={() => changeMetric("oceanPH", -0.1)} className="bg-yellow-600 px-3 py-1 rounded">-0.1</button>
          </div>
        </div>

        {/* Ice Level */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="font-bold">🧊 Ice Level: {earth.iceLevel.toFixed(1)}%</h2>
          <div className="flex gap-2 mt-2">
            <button onClick={() => changeMetric("iceLevel", +5)} className="bg-cyan-500 px-3 py-1 rounded">+5%</button>
            <button onClick={() => changeMetric("iceLevel", -5)} className="bg-gray-500 px-3 py-1 rounded">-5%</button>
          </div>
        </div>

        {/* Pollution */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="font-bold">🏭 Pollution: {earth.pollution.toFixed(1)} ppm</h2>
          <div className="flex gap-2 mt-2">
            <button onClick={() => changeMetric("pollution", +10)} className="bg-orange-600 px-3 py-1 rounded">+10</button>
            <button onClick={() => changeMetric("pollution", -10)} className="bg-green-700 px-3 py-1 rounded">-10</button>
          </div>
        </div>

        {/* Deforestation Switch */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-2 flex justify-between items-center">
          <h2 className="font-bold">🌲 Deforestation</h2>
          <button
            onClick={() => toggleMetric("deforestation")}
            className={`px-4 py-1 rounded ${earth.deforestation ? "bg-red-600" : "bg-green-600"}`}
          >
            {earth.deforestation ? "ON" : "OFF"}
          </button>
        </div>

        {/* Renewable Energy Switch */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-2 flex justify-between items-center">
          <h2 className="font-bold">⚡ Renewable Energy</h2>
          <button
            onClick={() => toggleMetric("renewableEnergy")}
            className={`px-4 py-1 rounded ${earth.renewableEnergy ? "bg-green-600" : "bg-gray-600"}`}
          >
            {earth.renewableEnergy ? "ON" : "OFF"}
          </button>
        </div>

        {/* Wildlife Protection Switch */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-2 flex justify-between items-center">
          <h2 className="font-bold">🐼 Wildlife Protection</h2>
          <button
            onClick={() => toggleMetric("wildlifeProtection")}
            className={`px-4 py-1 rounded ${earth.wildlifeProtection ? "bg-green-600" : "bg-red-600"}`}
          >
            {earth.wildlifeProtection ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-black/40 p-4 rounded-lg w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-2">📊 Earth Status</h2>
        <p>Temperature: {earth.temperature.toFixed(1)} °C</p>
        <p>Ocean pH: {earth.oceanPH.toFixed(2)}</p>
        <p>Ice Level: {earth.iceLevel.toFixed(1)}%</p>
        <p>Pollution: {earth.pollution.toFixed(1)} ppm</p>
        <p>🌲 Deforestation: {earth.deforestation ? "ON" : "OFF"}</p>
        <p>⚡ Renewable Energy: {earth.renewableEnergy ? "ON" : "OFF"}</p>
        <p>🐼 Wildlife Protection: {earth.wildlifeProtection ? "ON" : "OFF"}</p>
      </div>
    </div>
  );
};

export default App;
