import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/chat', chatRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
