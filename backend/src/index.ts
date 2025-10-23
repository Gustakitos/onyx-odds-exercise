import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';

import healthRoutes from './routes/health';
import matchRoutes from './routes/matches';
import sportRoutes from './routes/sports';
import teamRoutes from './routes/teams';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/sports', sportRoutes);
app.use('/api/v1/teams', teamRoutes);

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log('Sports Prediction API running');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();