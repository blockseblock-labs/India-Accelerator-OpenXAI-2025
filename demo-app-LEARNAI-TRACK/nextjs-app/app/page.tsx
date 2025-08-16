"use client";

import { useState } from "react";

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateFlashcards = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setFlashcards([]);

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch flashcards");
      }

      const data = await res.json();

      // Make sure data has flashcards
      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      } else {
        setError("No flashcards generated. Try again!");
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-800 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Flashcards</h1>
      <p className="mb-2 text-gray-700">Your notes</p>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Paste notes here..."
        className="w-[80%] max-w-3xl h-40 p-3 border-2 border-indigo-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={generateFlashcards}
        disabled={loading}
        className="mt-4 px-6 py-2 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((card, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-indigo-600 mb-2">Q: {card.question}</h2>
            <p className="text-gray-700">A: {card.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
