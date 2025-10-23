import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import matchRoutes from '../../../src/routes/matches';
import { seedTestData } from '../../setup';
import { testDb } from '../../setup';

jest.mock('../../../src/config/database', () => ({
  getDatabase: () => testDb
}));

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/matches', matchRoutes);

describe('Matches API v1 Integration Tests', () => {
  beforeEach(async () => {
    await seedTestData();
  });

  describe('GET /api/v1/matches', () => {
    it('should return all matches with default pagination', async () => {
      const response = await request(app)
        .get('/api/v1/matches')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('offset', 0);
      expect(response.body.pagination).toHaveProperty('hasMore');
    });

    it('should filter matches by sport', async () => {
      const response = await request(app)
        .get('/api/v1/matches?sport=Football')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      response.body.data.forEach((match: any) => {
        expect(match.sport_name.toLowerCase()).toBe('football');
      });
    });

    it('should filter matches by status', async () => {
      const response = await request(app)
        .get('/api/v1/matches?status=scheduled')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      response.body.data.forEach((match: any) => {
        expect(match.status).toBe('scheduled');
      });
    });

    it('should handle pagination with limit and offset', async () => {
      const response = await request(app)
        .get('/api/v1/matches?limit=5&offset=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(2);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should return 400 for invalid limit', async () => {
      const response = await request(app)
        .get('/api/v1/matches?limit=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .get('/api/v1/matches?status=invalid_status')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/v1/matches/:id', () => {
    it('should return a specific match by valid ID', async () => {
      const response = await request(app)
        .get('/api/v1/matches/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('sport_name');
      expect(response.body.data).toHaveProperty('home_team_name');
      expect(response.body.data).toHaveProperty('away_team_name');
      expect(response.body.data).toHaveProperty('match_date');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return 404 for non-existent match ID', async () => {
      const response = await request(app)
        .get('/api/v1/matches/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Match not found');
    });

    it('should return 400 for invalid match ID format', async () => {
      const response = await request(app)
        .get('/api/v1/matches/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for negative match ID', async () => {
      const response = await request(app)
        .get('/api/v1/matches/-1')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/v1/matches/sport/:sportName', () => {
    it('should return matches for a valid sport', async () => {
      const response = await request(app)
        .get('/api/v1/matches/sport/Football')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');

      response.body.data.forEach((match: any) => {
        expect(match.sport_name.toLowerCase()).toBe('football');
      });
    });

    it('should handle case-insensitive sport names', async () => {
      const response = await request(app)
        .get('/api/v1/matches/sport/football')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return empty array for non-existent sport', async () => {
      const response = await request(app)
        .get('/api/v1/matches/sport/NonExistentSport')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should handle pagination for sport matches', async () => {
      const response = await request(app)
        .get('/api/v1/matches/sport/Football?limit=3&offset=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.limit).toBe(3);
      expect(response.body.pagination.offset).toBe(1);
    });
  });

  describe('GET /api/v1/matches/status/:status', () => {
    it('should return matches with scheduled status', async () => {
      const response = await request(app)
        .get('/api/v1/matches/status/scheduled')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      response.body.data.forEach((match: any) => {
        expect(match.status).toBe('scheduled');
      });
    });

    it('should return matches with in_progress status', async () => {
      const response = await request(app)
        .get('/api/v1/matches/status/in_progress')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      response.body.data.forEach((match: any) => {
        expect(match.status).toBe('in_progress');
      });
    });

    it('should return matches with completed status', async () => {
      const response = await request(app)
        .get('/api/v1/matches/status/completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      response.body.data.forEach((match: any) => {
        expect(match.status).toBe('completed');
      });
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .get('/api/v1/matches/status/invalid_status')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid status');
    });

    it('should handle pagination for status matches', async () => {
      const response = await request(app)
        .get('/api/v1/matches/status/scheduled?limit=2&offset=0')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.offset).toBe(0);
    });
  });

  describe('Response Structure Validation', () => {
    it('should have consistent match object structure', async () => {
      const response = await request(app)
        .get('/api/v1/matches/1')
        .expect(200);

      const match = response.body.data;
      expect(match).toHaveProperty('id');
      expect(match).toHaveProperty('sport_id');
      expect(match).toHaveProperty('sport_name');
      expect(match).toHaveProperty('home_team_id');
      expect(match).toHaveProperty('home_team_name');
      expect(match).toHaveProperty('away_team_id');
      expect(match).toHaveProperty('away_team_name');
      expect(match).toHaveProperty('match_date');
      expect(match).toHaveProperty('status');
      expect(match).toHaveProperty('created_at');

      expect(typeof match.id).toBe('number');
      expect(typeof match.sport_id).toBe('number');
      expect(typeof match.sport_name).toBe('string');
      expect(typeof match.home_team_id).toBe('number');
      expect(typeof match.home_team_name).toBe('string');
      expect(typeof match.away_team_id).toBe('number');
      expect(typeof match.away_team_name).toBe('string');
      expect(typeof match.match_date).toBe('string');
      expect(typeof match.status).toBe('string');
      expect(['scheduled', 'in_progress', 'completed']).toContain(match.status);
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/matches/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
});