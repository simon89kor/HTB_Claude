import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import routineRoutes from './routes/routines';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'htb-api', version: '0.1.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routines', routineRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`HTB API Server running on port ${env.port}`);
});

export default app;
