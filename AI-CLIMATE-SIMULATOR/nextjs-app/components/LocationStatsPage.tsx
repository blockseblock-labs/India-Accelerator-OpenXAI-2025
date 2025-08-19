"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MetricsPanel = dynamic(() => import('./MetricsPanel'), { ssr: false });

interface EarthMetrics {
  co2Level: number;
  toxicityLevel: number;
  temperature: number;
  humanPopulation: number;
  animalPopulation: number;
  plantPopulation: number;
  oceanAcidity: number;
  iceCapMelting: number;
}

export default function LocationStatsPage() {
  // Live backend/LLM integration for real location-based metrics
  const [metrics, setMetrics] = useState<EarthMetrics | null>(null);
  const [pollutionLevel, setPollutionLevel] = useState<number | null>(null);
  const [location, setLocation] = useState('Pune, India');
  const [llmAnalysis, setLlmAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setApiError(null);
    // Example: Fetch real metrics from Open-Meteo (replace with a more authoritative source if needed)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.85&current_weather=true')
      .then(res => res.json())
      .then(async (weatherData) => {
        // Use real temperature, fallback to defaults for other metrics
        const realMetrics = {
          co2Level: 420, // Use latest global average from NOAA
          toxicityLevel: 7, // Placeholder, no public API
          temperature: weatherData.current_weather?.temperature || 24,
          humanPopulation: 7920000000, // World Population Review
          animalPopulation: 90000000000, // Estimate
          plantPopulation: 800000000000, // Estimate
          oceanAcidity: 8.1, // NOAA
          iceCapMelting: 13, // NASA
        };
        const realPollution = 19; // Placeholder, no public API
        // Now call backend with real metrics
        const res = await fetch('/api/process-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: `Get real climate stats for ${location}`,
            location,
            currentMetrics: realMetrics,
            pollutionLevel: realPollution,
            model: 'llama3.2:1b',
          }),
        });
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        setMetrics(data.metrics);
        setPollutionLevel(data.pollutionLevel);
        setLlmAnalysis(data.analysis);
      })
      .catch(() => {
        setApiError('Failed to fetch live metrics.');
      })
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="relative min-h-screen w-full bg-black font-orbitron overflow-hidden">
      {/* Sci-fi HUD overlays */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{mixBlendMode:'screen'}}>
        <g stroke="#00ff99" strokeWidth="1.2" opacity="0.18">
          <rect x="5%" y="10%" width="90%" height="80%" rx="24" fill="none" />
          <circle cx="50%" cy="50%" r="38%" fill="none" />
          <circle cx="50%" cy="50%" r="30%" fill="none" />
          <line x1="0" y1="20%" x2="100%" y2="20%" />
          <line x1="0" y1="80%" x2="100%" y2="80%" />
        </g>
      </svg>
      {/* Animated background */}
      <div className="absolute inset-0 z-0 animated-space-bg pointer-events-none" />
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-black/70 border-2 border-green-400/40 rounded-3xl px-12 py-10 shadow-2xl max-w-2xl w-full mt-24">
          <h1 className="text-5xl font-extrabold mb-6 tracking-widest text-green-300 text-center sci-fi-glow">LOCATION STATS</h1>
          <div className="flex flex-col items-center mb-8">
            <div className="text-lg text-green-200 font-mono tracking-widest mb-2">Location:</div>
            <div className="text-2xl font-bold text-green-400 sci-fi-glow mb-2">{location}</div>
            <div className="text-sm text-green-300/80">(Live metrics powered by LLM)</div>
          </div>
          {apiError && <div className="text-red-400 text-center mb-4">{apiError}</div>}
          <div className="flex flex-col items-center gap-6">
            <div className="w-full flex justify-center">
              {metrics && pollutionLevel !== null ? (
                <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} animate />
              ) : (
                <div className="text-green-300 animate-pulse">Loading metrics...</div>
              )}
            </div>
            <div className="w-full bg-black/60 border border-green-400/30 rounded-xl px-6 py-4 mt-4 shadow-inner">
              <div className="text-green-300 font-mono text-base mb-2 tracking-wider">LLM Analysis</div>
              <div className="text-green-100 text-lg font-semibold sci-fi-glow min-h-[40px]">
                {loading ? <span className="animate-pulse">Analyzing...</span> : llmAnalysis}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
