import React from 'react';

// SVG map of Amazon region (simplified, stylized for dashboard)
// This is a placeholder. For a more detailed map, use a geojson or SVG from a GIS source.
export default function AmazonMap({ highlightedCities = [], width = 400, height = 300 }) {
  // Example city coordinates (relative to SVG viewBox)
  const cities = [
    { name: 'Manaus', x: 180, y: 120, status: 'active' },
    { name: 'Belém', x: 300, y: 100, status: 'unverified' },
    { name: 'Rio Branco', x: 80, y: 200, status: 'offline' },
    { name: 'Porto Velho', x: 140, y: 160, status: 'active' },
  ];
  const statusColor = {
    active: '#22c55e',
    unverified: '#fde047',
    offline: '#ef4444',
  };
  return (
    <svg viewBox="0 0 400 300" width={width} height={height} className="rounded-xl">
      {/* Amazon region shape (stylized) */}
      <path d="M60,220 Q100,60 200,60 Q320,80 340,200 Q300,260 200,250 Q100,240 60,220 Z" fill="#5ecfff22" stroke="#5ecfff" strokeWidth="4" />
      {/* Cities */}
      {cities.map(city => (
        <circle key={city.name} cx={city.x} cy={city.y} r={9} fill={statusColor[city.status]} stroke="#fff" strokeWidth="2" />
      ))}
      {/* City labels */}
      {cities.map(city => (
        <text key={city.name+"-label"} x={city.x+12} y={city.y+4} fontSize="13" fill="#b6c9e0">{city.name}</text>
      ))}
    </svg>
  );
}
