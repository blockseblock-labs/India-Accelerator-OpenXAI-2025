// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:3000'], methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('🔌 client connected:', socket.id);

  // when a client sends a message, broadcast it to everyone
  socket.on('chat:message', (payload) => {
    // payload: { user, text }
    const msg = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      user: payload.user || 'Anonymous',
      text: String(payload.text || '').slice(0, 2000),
      ts: new Date().toISOString(),
    };
    io.emit('chat:message', msg);
  });

  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user || 'Someone');
  });

  socket.on('disconnect', () => {
    console.log('❌ client disconnected:', socket.id);
  });
});

app.get('/', (_req, res) => res.send('Realtime server up ✅'));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Socket.IO server on http://localhost:${PORT}`));
