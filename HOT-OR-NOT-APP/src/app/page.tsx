// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [result, setResult] = useState<{ verdict: string; description: string; fullResponse: string } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setResult(null);
//       setError(null);

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("image", selectedFile);

//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to analyze image");
//       }

//       setResult(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-6">
//       <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg w-full transition-all hover:shadow-red-400/50">
//         <h1 className="text-4xl font-extrabold text-center text-red-600 drop-shadow mb-6">
//           🔥 HOT or NOT 🔥
//         </h1>

//         <div className="space-y-6">
//           {/* File Upload */}
//           <div className="border-2 border-dashed border-red-300 hover:border-red-500 transition rounded-xl p-6 text-center cursor-pointer">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileSelect}
//               className="hidden"
//               id="image-upload"
//             />
//             <label htmlFor="image-upload" className="block">
//               <div className="text-gray-600 hover:scale-105 transition-transform">
//                 <svg
//                   className="mx-auto h-14 w-14 mb-3 text-red-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//                 <p className="text-lg font-semibold">Click to upload an image</p>
//                 <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
//               </div>
//             </label>
//           </div>

//           {/* Image Preview */}
//           {preview && (
//             <div className="text-center">
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="max-w-full h-64 object-cover rounded-xl shadow-lg mx-auto transform hover:scale-105 transition-transform"
//               />
//               <p className="text-sm text-gray-600 mt-2 font-medium">
//                 {selectedFile?.name}
//               </p>
//             </div>
//           )}

//           {/* Analyze Button */}
//           {selectedFile && (
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all"
//             >
//               {loading ? "🔎 Analyzing..." : "🔥 Analyze Image 🔥"}
//             </button>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
//               ⚠️ {error}
//             </div>
//           )}

//           {/* Result */}
//           {result && (
//             <div className="text-center mt-6">
//               <div
//                 className={`text-6xl font-extrabold mb-4 drop-shadow ${
//                   result.verdict === "HOT"
//                     ? "text-red-600 animate-bounce"
//                     : "text-gray-600 grayscale"
//                 }`}
//               >
//                 {result.verdict === "HOT" ? "🔥 HOT 🔥" : "❌ NOT ❌"}
//               </div>
//               <div className="text-lg font-medium text-gray-700 mb-4">
//                 {result.description}
//               </div>
//               <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
//                 <p className="text-sm text-gray-600">💡 Full AI Response:</p>
//                 <p className="font-medium text-sm">{result.fullResponse}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{
    verdict: string;
    description: string;
    fullResponse: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-xl w-full transform transition-all hover:shadow-red-400/50">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-center text-red-600 drop-shadow-lg mb-8 tracking-tight">
          🔥 Hot or Not 🔥
        </h1>

        <div className="space-y-8">
          {/* File Upload */}
          <div className="border-2 border-dashed border-red-300 hover:border-red-500 transition rounded-2xl p-8 text-center cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="block">
              <div className="text-gray-600 group-hover:scale-105 transition-transform">
                <svg
                  className="mx-auto h-16 w-16 mb-4 text-red-500 group-hover:animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-xl font-semibold">Click to upload an image</p>
                <p className="text-sm text-gray-500">
                  Supported: PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </label>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="text-center space-y-3">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-64 object-cover rounded-2xl shadow-xl mx-auto transform hover:scale-105 transition-transform"
              />
              <p className="text-sm text-gray-600 font-medium">
                {selectedFile?.name}
              </p>
            </div>
          )}

          {/* Analyze Button */}
          {selectedFile && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {loading ? "🔎 Analyzing..." : "🔥 Analyze Image 🔥"}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl text-center font-medium shadow-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="text-center mt-8 space-y-4">
              <div
                className={`text-6xl font-extrabold drop-shadow-lg ${
                  result.verdict === "HOT"
                    ? "text-red-600 animate-bounce"
                    : "text-gray-500 grayscale"
                }`}
              >
                {result.verdict === "HOT" ? "🔥 HOT 🔥" : "❌ NOT ❌"}
              </div>
              <p className="text-lg font-medium text-gray-700">
                {result.description}
              </p>
              <div className="bg-gray-100 p-5 rounded-xl shadow-inner text-left">
                <p className="text-sm text-gray-600 mb-1">💡 Full AI Response:</p>
                <p className="font-medium text-sm leading-relaxed">
                  {result.fullResponse}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
