import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { getOllamaResponse } from "./chat.js";   // import chat helper

const app = express();
const PORT = 5000;

app.use(cors());

// Multer: store file in memory
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

  const tmpPath = path.resolve(`./temp-${Date.now()}.wav`);
  fs.writeFileSync(tmpPath, req.file.buffer);

  const pyScript = path.resolve("transcribe.py");
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
      fs.unlinkSync(tmpPath);

      if (code !== 0) {
        return res.status(500).json({ error: "Python transcription failed", details: errorOutput });
      }

      // ✅ Call Ollama here
      const modelResponse = await getOllamaResponse(transcription.trim());

      res.json({ transcription: transcription.trim(), modelResponse });
    });

  } catch (err) {
    console.error("Server exception:", err);
    fs.unlinkSync(tmpPath);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
