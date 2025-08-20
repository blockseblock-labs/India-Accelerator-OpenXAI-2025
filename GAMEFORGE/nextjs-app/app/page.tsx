export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      <div className="px-6 text-center text-white">
        {/* Title */}
        <h1 className="mb-6 text-5xl font-extrabold md:text-6xl drop-shadow-lg">
          🎮 Game Jam Template
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg md:text-xl opacity-90">
          Ready to build your next <span className="font-semibold text-yellow-300">amazing game</span>?
        </p>

        {/* Canvas Container */}
        <div className="inline-block p-6 border shadow-lg md:p-8 rounded-2xl bg-black/30 backdrop-blur-lg border-white/20">
          <canvas
            id="gameCanvas"
            width="600"
            height="400"
            className="border-2 shadow-inner border-white/30 rounded-xl"
          >
            Your browser does not support the canvas element.
          </canvas>
          <p className="mt-4 text-sm text-gray-200 opacity-80">
            Game canvas is ready for your creativity 🚀
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button className="px-6 py-3 font-semibold transition-all duration-300 shadow-md rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-green-500 hover:to-teal-500">
            Start Game
          </button>
          <button className="px-6 py-3 font-semibold transition-all duration-300 shadow-md rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-pink-500 hover:to-red-500">
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
