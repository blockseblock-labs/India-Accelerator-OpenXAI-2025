// backend/audio.js
import express from "express";
import pkg from "gtts";   // gtts doesn’t support pure ESM import
const gTTS = pkg;

const router = express.Router();

// POST /api/audio/speak
router.post("/speak", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const gtts = new gTTS(text, "en");
    const chunks = [];

    const stream = gtts.stream();

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length,
      });
      res.send(buffer);
    });
    stream.on("error", (err) => {
      console.error("gTTS error:", err);
      res.status(500).json({ error: "TTS generation failed" });
    });
  } catch (err) {
    console.error("TTS route error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
