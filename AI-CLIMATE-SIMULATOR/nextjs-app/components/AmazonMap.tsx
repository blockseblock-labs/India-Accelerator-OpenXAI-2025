"use client";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// Amazon region geo-coordinates (approximate, for demo)
const amazonRegion = [
  { name: "Manaus", coordinates: [-60.025, -3.107] },
  { name: "Leticia", coordinates: [-69.9406, -4.215] },
  { name: "Iquitos", coordinates: [-73.2472, -3.7437] },
  { name: "Macapá", coordinates: [-51.0501, 0.0349] },
  { name: "Belém", coordinates: [-48.5011, -1.4558] },
  { name: "Porto Velho", coordinates: [-63.9039, -8.7608] },
];

export default function AmazonMap() {
  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 600, center: [-60, -4] }}
        width={600}
        height={400}
        style={{ background: "transparent" }}
      >
        <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/continents/south-america.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#112244"
                stroke="#5ecfff"
                style={{ outline: "none" }}
              />
            ))
          }
        </Geographies>
        {amazonRegion.map((city, i) => (
          <Marker key={city.name} coordinates={city.coordinates}>
            <circle r={8} fill="#5ecfff" opacity={0.7} />
            <text
              textAnchor="middle"
              y={-16}
              style={{ fontFamily: "sans-serif", fill: "#5ecfff", fontSize: 12 }}
            >
              {city.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
