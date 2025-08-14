import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { translateText } from "./ollama";

interface Room {
  users: string[];
  languages: [string, string];
  messages: any[];
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const rooms: Record<string, Room> = {};

function generateCode(): string {
  return Math.random().toString(36).substring(2, 7);
}

// Create Room
app.post("/create-room", (req: Request, res: Response) => {
  const { userLang, otherLang } = req.body;
  const code = generateCode();
  rooms[code] = {
    users: [],
    languages: [userLang, otherLang],
    messages: []
  };
  console.log(`Room created: ${code} [${userLang} -> ${otherLang}]`);
  res.json({ code });
});

// Join Room
app.post("/join-room", (req: Request, res: Response) => {
  const { code } = req.body;
  if (rooms[code]) {
    res.json({ success: true, languages: rooms[code].languages });
  } else {
    res.status(404).json({ success: false, error: "Room not found" });
  }
});

// SOCKET.IO chat
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ code, lang }) => {
    socket.join(code);
    (socket as any).lang = lang;
    (socket as any).code = code;
  });

  socket.on("chatMessage", async ({ code, text, fromLang, toLang }) => {
    let translated;
    try {
      translated = await translateText(text, fromLang, toLang);
    } catch {
      translated = "ERROR: Translation failed!";
    }

    io.to(code).emit("message", {
      original: text,
      translated,
      fromLang,
      toLang
    });
  });
});

const PORT = 5000;
httpServer.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
