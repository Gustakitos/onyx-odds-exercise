import { getDatabase } from '../config/database';

export interface Match {
  id: number;
  sport_id: number;
  sport_name?: string;
  home_team_id: number;
  home_team_name?: string;
  away_team_id: number;
  away_team_name?: string;
  match_date: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  home_score: number;
  away_score: number;
  created_at?: string;
}

export interface MatchFilters {
  sport?: string;
  status?: 'scheduled' | 'in_progress' | 'completed';
  team?: string;
  date?: string;
  limit?: number;
  offset?: number;
}

async function getAllMatches(filters: MatchFilters = {}): Promise<Match[]> {
  const db = getDatabase();

  let query = `
      SELECT 
        m.id,
        m.sport_id,
        s.name as sport_name,
        m.home_team_id,
        ht.name as home_team_name,
        m.away_team_id,
        at.name as away_team_name,
        m.match_date,
        m.status,
        m.home_score,
        m.away_score,
        m.created_at
      FROM matches m
      JOIN sports s ON m.sport_id = s.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
    `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.sport) {
    conditions.push('LOWER(s.name) = LOWER(?)');
    params.push(filters.sport);
  }

  if (filters.status) {
    conditions.push('m.status = ?');
    params.push(filters.status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY m.match_date ASC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Match[]);
      }
    });
  });
}

async function getMatchById(id: number): Promise<Match | null> {
  const db = getDatabase();

  const query = `
      SELECT 
        m.id,
        m.sport_id,
        s.name as sport_name,
        m.home_team_id,
        ht.name as home_team_name,
        m.away_team_id,
        at.name as away_team_name,
        m.match_date,
        m.status,
        m.home_score,
        m.away_score,
        m.created_at
      FROM matches m
      JOIN sports s ON m.sport_id = s.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.id = ?
    `;

  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? (row as Match) : null);
      }
    });
  });
}

async function getMatchesBySport(sportName: string): Promise<Match[]> {
  return getAllMatches({ sport: sportName });
}

async function getMatchesByStatus(status: 'scheduled' | 'in_progress' | 'completed'): Promise<Match[]> {
  return getAllMatches({ status });
}

async function getTotalMatchesCount(filters: Omit<MatchFilters, 'limit' | 'offset'> = {}): Promise<number> {
  const db = getDatabase();

  let query = `
      SELECT COUNT(*) as count
      FROM matches m
      JOIN sports s ON m.sport_id = s.id
    `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.sport) {
    conditions.push('LOWER(s.name) = LOWER(?)');
    params.push(filters.sport);
  }

  if (filters.status) {
    conditions.push('m.status = ?');
    params.push(filters.status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

const match = {
  getAllMatches,
  getMatchById,
  getMatchesBySport,
  getMatchesByStatus,
  getTotalMatchesCount
}

export default match;
