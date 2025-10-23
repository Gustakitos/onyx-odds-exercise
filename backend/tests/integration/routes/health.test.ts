import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from '../../../src/routes/health';
import gameRoutes from '../../../src/routes/matches';
import sportRoutes from '../../../src/routes/sports';
import teamRoutes from '../../../src/routes/teams';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/health', healthRoutes);

describe('Health API v1 Integration Tests', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status with 200', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Sports Prediction API is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('should include database connection status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('database');
      expect(response.body.database).toBe('Connected');
    });

    it('should return proper headers', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should respond within reasonable time', async () => {
      const start = Date.now();
      await request(app)
        .get('/api/v1/health')
        .expect(200);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});