import express from 'express';
import { validateId } from '../utils/validation';
import team from '../models/Team';
import match from '../models/Match';

const router = express.Router();

// GET /api/teams - Get all teams with optional sport filtering
router.get('/', async (req, res) => {
  try {
    const teams = await team.getAllTeams();

    return res.json({
      success: true,
      data: teams
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/teams/:id - Get a specific team by ID
router.get('/:id', async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);

    const validation = validateId(teamId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID',
        errors: validation.errors
      });
    }

    const foundTeam = await team.getTeamById(teamId);

    if (!foundTeam) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    return res.json({
      success: true,
      data: foundTeam
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/teams/:id/matches - Get all matches for a specific team
router.get('/:id/matches', async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const validation = validateId(teamId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID',
        errors: validation.errors
      });
    }

    const foundTeam = await team.getTeamById(teamId);
    if (!foundTeam) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const matches = await match.getAllMatches({
      team: foundTeam.name,
      limit,
      offset
    });

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
      message: 'Failed to fetch matches by team',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;