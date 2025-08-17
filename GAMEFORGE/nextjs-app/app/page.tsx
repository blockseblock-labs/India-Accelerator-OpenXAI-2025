export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-3xl">
        <h1 className="text-6xl sm:text-5xl font-extrabold mb-6 text-purple-400 drop-shadow-[0_0_10px_rgba(147,51,234,0.7)]">
          🎮 Game Jam Template
        </h1>
        <p className="text-xl sm:text-lg mb-10 opacity-80 text-gray-300">
          Ready to build your next amazing game!
        </p>
        <div className="bg-gray-800/70 p-8 rounded-2xl backdrop-blur-md shadow-lg border border-gray-700 transition-transform transform hover:scale-105">
          <canvas 
            id="gameCanvas" 
            width="400" 
            height="300" 
            className="w-full max-w-md h-auto border-2 border-gray-600 rounded-lg shadow-[0_0_20px_rgba(128,0,255,0.5)]"
          >
            Your browser does not support the canvas element.
          </canvas>
          <p className="mt-4 text-sm opacity-70 italic text-gray-400">
            Game canvas ready for your creativity!
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <button className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_10px_rgba(0,255,128,0.7)] hover:shadow-[0_0_20px_rgba(0,255,128,1)] transition-all duration-300">
            Start Game
          </button>
          <button className="bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_10px_rgba(255,0,128,0.7)] hover:shadow-[0_0_20px_rgba(255,0,128,1)] transition-all duration-300">
            Reset
          </button>
        </div>
      </div>
    </main>
  )
}
