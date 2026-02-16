import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'htb-api', version: '0.1.0' });
});

// Routes will be added by each team agent
// app.use('/api/auth', authRoutes);
// app.use('/api/routines', routineRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/community', communityRoutes);

app.listen(PORT, () => {
  console.log(`HTB API Server running on port ${PORT}`);
});

export default app;
