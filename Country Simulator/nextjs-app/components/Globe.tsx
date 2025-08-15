// components/Globe.tsx
"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import CountryInfoPanel from "./CountryInfoPanel";

type Country = {
  name: string;
  currency: string;
  flag: string;
  lat: number;
  lon: number;
  position?: THREE.Vector3;
};

const COUNTRIES: Country[] = [
  { name: "India", currency: "INR", flag: "🇮🇳", lat: 20.5937, lon: 78.9629 },
  { name: "USA", currency: "USD", flag: "🇺🇸", lat: 37.0902, lon: -95.7129 },
  { name: "China", currency: "CNY", flag: "🇨🇳", lat: 35.8617, lon: 104.1954 },
  { name: "Russia", currency: "RUB", flag: "🇷🇺", lat: 61.524, lon: 105.3188 },
  { name: "Japan", currency: "JPY", flag: "🇯🇵", lat: 36.2048, lon: 138.2529 },
];

const latLonToVec3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

function Earth({
  setHoveredCountry,
  setMousePos,
}: {
  setHoveredCountry: (c: Country | null) => void;
  setMousePos: (pos: { x: number; y: number }) => void;
}) {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.001;
  });

  const markers = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        ...c,
        position: latLonToVec3(c.lat, c.lon, 1.01),
      })),
    []
  );

  return (
    <group>
      {/* Black Globe */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#000000"
          emissive="#111111"
          emissiveIntensity={0.05}
          metalness={0.2}
          roughness={0.8}
        />
      </Sphere>

      {/* Neon Atmosphere */}
      <Sphere args={[1.02, 64, 64]}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {markers.map((c, idx) => (
        <CountryMarker
          key={idx}
          country={c}
          setHoveredCountry={setHoveredCountry}
          setMousePos={setMousePos}
        />
      ))}
    </group>
  );
}

function CountryMarker({
  country,
  setHoveredCountry,
  setMousePos,
}: {
  country: Country;
  setHoveredCountry: (c: Country | null) => void;
  setMousePos: (pos: { x: number; y: number }) => void;
}) {
  const pinRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (pinRef.current) {
      const baseScale = hovered ? 1.4 : 1;
      const scale = baseScale + Math.sin(clock.getElapsedTime() * 5) * 0.07;
      pinRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group
      position={country.position}
      ref={pinRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredCountry(country);
        setHovered(true);
      }}
      onPointerMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      onPointerOut={() => {
        setHoveredCountry(null);
        setHovered(false);
      }}
    >
      <mesh>
        <coneGeometry args={[0.008, 0.03, 16]} />
        <meshStandardMaterial
          color="#0ff"
          emissive="#0ff"
          emissiveIntensity={hovered ? 2 : 1}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={hovered ? 3 : 1.5}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function Globe() {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 3] }}
        style={{ width: "100%", height: "600px", background: "transparent" }}
      >
        <ambientLight intensity={0.25} color="#0ff" />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ff00ff" />
        <Earth setHoveredCountry={setHoveredCountry} setMousePos={setMousePos} />
        <OrbitControls enablePan={false} enableZoom zoomSpeed={0.5} />
      </Canvas>

      <CountryInfoPanel
        country={
          hoveredCountry
            ? {
                name: hoveredCountry.name,
                currency: hoveredCountry.currency,
                flag: hoveredCountry.flag,
              }
            : null
        }
        mousePos={mousePos}
        followMouse
      />
    </>
  );
}