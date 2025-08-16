// backend/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import fetch from "node-fetch"; // npm i node-fetch
import { fileURLToPath } from "url";
import { getOllamaResponse } from "./chat.js";   // your Ollama helper (streaming or non-streaming)
import audioRoutes from "./audio.js";            // must expose POST /api/audio/speak

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount TTS routes (expects /api/audio/speak)
app.use("/api/audio", audioRoutes);

// Multer: store uploaded audio in memory
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/upload
 * - Receives WAV blob
 * - Calls Python transcription
 * - Calls Ollama for response text
 * - Calls TTS route to get audio (mp3 bytes) and returns it as base64
 */
app.post("/api/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

  // Save temp WAV so Python can read it
  const tmpPath = path.resolve(__dirname, `./temp-${Date.now()}.wav`);
  fs.writeFileSync(tmpPath, req.file.buffer);

  // Python script path (same folder as server.js or adjust if different)
  const pyScript = path.resolve(__dirname, "transcribe.py");
  console.log("Running Python script:", pyScript);

  try {
    const py = spawn("python", [pyScript, tmpPath], { shell: true });

    let transcription = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      transcription += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Python stderr:", data.toString());
    });

    py.on("close", async (code) => {
      // cleanup temp file
      try { fs.unlinkSync(tmpPath); } catch {}

      if (code !== 0) {
        return res.status(500).json({ error: "Python transcription failed", details: errorOutput });
      }

      const userText = transcription.trim();
      console.log("Transcription:", userText);

      // Get LLM response from Ollama
      const modelResponse = await getOllamaResponse(userText);
      console.log("Ollama response:", modelResponse);

      // Generate TTS audio for Ollama response
      let audioBase64 = null;
      try {
        const ttsRes = await fetch("http://localhost:5000/api/audio/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: modelResponse }),
        });

        if (!ttsRes.ok) {
          const errText = await ttsRes.text();
          console.error("TTS HTTP error:", errText);
        } else {
          const buf = await ttsRes.arrayBuffer();
          audioBase64 = Buffer.from(buf).toString("base64"); // mp3 bytes -> base64
        }
      } catch (err) {
        console.error("TTS generation failed:", err);
      }

      res.json({
        transcription: userText,
        modelResponse,
        modelResponseAudio: audioBase64, // base64 (audio/mpeg)
      });
    });
  } catch (err) {
    console.error("Server exception:", err);
    try { fs.unlinkSync(tmpPath); } catch {}
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
