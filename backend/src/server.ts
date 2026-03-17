import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Payout Management API is running' });
});

// Routes will be added here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
