"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ verdict: string; description: string; fullResponse: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-red-900">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Moving gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.03}px, ${-mousePosition.y * 0.03}px)`,
            transition: 'transform 0.5s ease-out',
            animationDelay: '1s'
          }}
        />
        
        {/* Animated geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white/10 rotate-45 animate-spin-slow" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border-4 border-pink-300/20 rounded-full animate-bounce-slow" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div 
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-white/20 animate-slide-up"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Floating header */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-2xl animate-glow">
                <span className="text-4xl animate-bounce">🔥</span>
              </div>
            </div>
            <h1 className="text-5xl font-black mb-3 animate-text-gradient">
              <span className="bg-gradient-to-r from-white via-pink-200 to-red-200 bg-clip-text text-transparent">
                HOT or NOT
              </span>
            </h1>
            <p className="text-white/80 text-lg font-medium animate-fade-in">
              Unleash the power of AI judgment ✨
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Enhanced File Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-500 cursor-pointer group overflow-hidden
                ${dragOver 
                  ? 'border-red-400 bg-red-500/20 scale-105 shadow-2xl' 
                  : preview 
                    ? 'border-green-400 bg-green-500/20 shadow-xl' 
                    : 'border-white/30 hover:border-red-400 hover:bg-red-500/10 hover:scale-105'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block relative z-10">
                <div className="text-white">
                  {preview ? (
                    <div className="space-y-4 animate-scale-in">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/30 rounded-full backdrop-blur-sm animate-pulse-slow">
                        <svg className="w-10 h-10 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-green-300 animate-bounce">Image Loaded!</p>
                      <p className="text-white/70">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-float-gentle">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm group-hover:bg-red-500/30 transition-all duration-300 animate-pulse-slow">
                        <svg className="w-10 h-10 group-hover:text-red-300 transition-colors animate-bounce-gentle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold mb-2">Drop your image here</p>
                        <p className="text-white/70">or click to browse</p>
                        <p className="text-sm text-white/50 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Enhanced Image Preview */}
            {preview && (
              <div className="text-center animate-zoom-in">
                <div className="relative inline-block group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                  <img
                    src={preview}
                    alt="Preview"
                    className="relative max-w-full h-72 object-cover rounded-2xl mx-auto shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                  />
                  <button
                    onClick={resetApp}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg hover:scale-110 animate-pulse"
                  >
                    ×
                  </button>
                </div>
                <p className="text-white/80 mt-4 font-semibold text-lg animate-fade-in">{selectedFile?.name}</p>
              </div>
            )}

            {/* Enhanced Analyze Button */}
            {selectedFile && !result && (
              <div className="animate-slide-up-delayed">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`relative w-full font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group
                    ${loading 
                      ? 'bg-gray-500/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white hover:shadow-2xl animate-glow-button'
                    }`}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xl">Analyzing Magic...</span>
                        <div className="animate-bounce">🔮</div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3 text-xl">
                        <span className="animate-bounce">🔥</span>
                        <span className="font-black">UNLEASH THE JUDGMENT</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>🔥</span>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Enhanced Error Message */}
            {error && (
              <div className="relative bg-red-500/20 border border-red-400/50 backdrop-blur-sm text-red-200 p-5 rounded-2xl animate-shake">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <span className="font-semibold text-lg">{error}</span>
                </div>
              </div>
            )}

            {/* Enhanced Result Display */}
            {result && (
              <div className="text-center animate-result-reveal">
                <div className={`text-8xl font-black mb-6 animate-result-bounce ${
                  result.verdict === "HOT" ? "text-red-400" : "text-gray-400"
                }`}>
                  {result.verdict === "HOT" ? (
                    <div className="animate-fire-glow">🔥 HOT 🔥</div>
                  ) : (
                    <div className="animate-fade-pulse">❌ NOT ❌</div>
                  )}
                </div>
                
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 space-y-6 border border-white/20 animate-card-float">
                  <div className="text-2xl font-bold text-white animate-text-glow">
                    {result.description}
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <p className="text-lg font-bold text-white/90 mb-3 animate-fade-in">AI Verdict:</p>
                    <p className="text-white/80 leading-relaxed text-lg">{result.fullResponse}</p>
                  </div>
                </div>

                <button
                  onClick={resetApp}
                  className="mt-8 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl relative overflow-hidden group animate-glow-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center justify-center space-x-3 text-xl">
                    <span className="animate-spin-slow">🎯</span>
                    <span className="font-black">JUDGE ANOTHER</span>
                    <span className="animate-bounce">✨</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.3); }
        }
        
        @keyframes glow-button {
          0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.6), 0 0 70px rgba(239, 68, 68, 0.2); }
        }
        
        @keyframes fire-glow {
          0%, 100% { text-shadow: 0 0 20px #ff6b6b; }
          50% { text-shadow: 0 0 40px #ff6b6b, 0 0 60px #ff3838; }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
        }
        
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-up-delayed {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-down {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes result-reveal {
          0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes result-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }
        
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes fade-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-glow-button { animation: glow-button 2s ease-in-out infinite; }
        .animate-fire-glow { animation: fire-glow 1.5s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .animate-text-gradient { animation: text-gradient 3s ease infinite; background-size: 200% 200%; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-up-delayed { animation: slide-up-delayed 0.8s ease-out 0.2s both; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-zoom-in { animation: zoom-in 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-result-reveal { animation: result-reveal 1s ease-out; }
        .animate-result-bounce { animation: result-bounce 1s ease-out; }
        .animate-card-float { animation: card-float 4s ease-in-out infinite; }
        .animate-fade-pulse { animation: fade-pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}