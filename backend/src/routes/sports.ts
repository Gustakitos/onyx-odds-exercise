import express from 'express';
import { validateId } from '../utils/validation';
import sport from '../models/Sport';
import team from '../models/Team';
import match from '../models/Match';

const router = express.Router();

// GET /api/sports - Get all sports
router.get('/', async (req, res) => {
  try {
    const sports = await sport.getAllSports();

    return res.json({
      success: true,
      data: sports
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sports',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/sports/:id - Get a specific sport by ID
router.get('/:id', async (req, res) => {
  try {
    const sportId = parseInt(req.params.id);

    const validation = validateId(sportId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sport ID',
        errors: validation.errors
      });
    }

    const foundSport = await sport.getSportById(sportId);

    if (!foundSport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    return res.json({
      success: true,
      data: foundSport
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sport',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/sports/:id/teams - Get all teams for a specific sport
router.get('/:id/teams', async (req, res) => {
  try {
    const sportId = parseInt(req.params.id);

    const validation = validateId(sportId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sport ID',
        errors: validation.errors
      });
    }

    const teams = await team.getTeamsBySport(sportId);

    return res.json({
      success: true,
      data: teams
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch teams by sport',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/sports/:id/matches - Get all matches for a specific sport
router.get('/:id/matches', async (req, res) => {
  try {
    const sportId = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const validation = validateId(sportId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sport ID',
        errors: validation.errors
      });
    }

    const foundSport = await sport.getSportById(sportId);
    if (!foundSport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    const matches = await match.getMatchesBySport(foundSport.name);

    return res.json({
      success: true,
      data: matches,
      pagination: {
        limit,
        offset,
        hasMore: matches.length === limit
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch matches by sport',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;