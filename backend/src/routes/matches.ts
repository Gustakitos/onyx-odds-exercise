import express from 'express';
import { validateMatchFilters, validateId } from '../utils/validation';
import match, { MatchFilters } from '../models/Match';

const router = express.Router();

// GET /api/matches - Get all matches with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    const filters: MatchFilters = {
      sport: req.query.sport as string,
      status: req.query.status as 'scheduled' | 'in_progress' | 'completed',
      team: req.query.team as string,
      date: req.query.date as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const validation = validateMatchFilters(filters);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filters',
        errors: validation.errors
      });
    }


    const matches = await match.getAllMatches(filters);
    const totalCount = await match.getTotalMatchesCount(filters);

    return res.json({
      success: true,
      data: matches,
      pagination: {
        total: totalCount,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: (filters.offset || 0) + matches.length < totalCount
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch matches',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/matches/:id - Get a specific match by ID
router.get('/:id', async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);

    const validation = validateId(matchId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid match ID',
        errors: validation.errors
      });
    }

    const foundMatch = await match.getMatchById(matchId);

    if (!foundMatch) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    return res.json({
      success: true,
      data: foundMatch
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch match',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/matches/sport/:sportName - Get matches by sport
router.get('/sport/:sportName', async (req, res) => {
  try {
    const sportName = req.params.sportName;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const matches = await match.getMatchesBySport(sportName);

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

// GET /api/matches/status/:status - Get matches by status
router.get('/status/:status', async (req, res) => {
  try {
    const status = req.params.status as 'scheduled' | 'in_progress' | 'completed';
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    if (!['scheduled', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: scheduled, in_progress, completed'
      });
    }

    const matches = await match.getMatchesByStatus(status);

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
      message: 'Failed to fetch matches by status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;