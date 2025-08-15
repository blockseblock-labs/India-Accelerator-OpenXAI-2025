import express from 'express';
import axios from 'axios';

const router = express.Router();
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";

router.post('/', async (req, res) => {
  const { message } = req.body;
  console.log("Received message from frontend:", message);

  if (!message) {
    console.log("No message provided in request body");
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    console.log(`Sending request to Ollama at ${OLLAMA_HOST}/v1/completions`);
    const response = await axios.post(`${OLLAMA_HOST}/v1/completions`, {
      model: "llama3:latest",
      prompt: message,
      max_tokens: 200
    });

    console.log("Raw response from Ollama:", response.data);

    const botMessage = response.data?.choices?.[0]?.text || "I couldn't respond";
console.log("Bot response:", botMessage);
res.json({ bot: botMessage });


    res.json({ bot: botMessage });

  } catch (err) {
    console.log("Ollama API call failed!");
    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Data:", err.response.data);
    } else {
      console.log("Error message:", err.message);
    }
    res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
});

export default router;
