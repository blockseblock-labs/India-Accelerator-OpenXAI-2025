"use client";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-green-400 text-black">
      <h1 className="text-5xl font-bold mb-6">AI Climate Simulator</h1>
      <p className="text-xl mb-8 max-w-2xl text-center">
        Explore climate change scenarios interactively using AI-powered
        simulations.
      </p>
      <button
        onClick={onStart}
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        Start Simulation
      </button>
    </section>
  );
}
