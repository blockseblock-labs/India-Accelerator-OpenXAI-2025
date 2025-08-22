export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-8">🎮 Game Jam Template</h1>
        <p className="text-xl mb-8">Ready to build your next amazing game!</p>
        <div className="bg-black/20 p-8 rounded-lg backdrop-blur-sm">
          <canvas 
            id="gameCanvas" 
            width="400" 
            height="300" 
            className="border-2 border-white/30 rounded"
          >
            Your browser does not support the canvas element.
          </canvas>
          <p className="mt-4 text-sm opacity-80">Game canvas ready for your creativity!</p>
        </div>
        <div className="mt-8 space-x-4">
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors">
            Start Game
          </button>
          <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition-colors">
            Reset
          </button>
        </div>
      </div>
    </main>
  )
} 