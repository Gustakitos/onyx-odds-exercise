import { getDatabase } from '../config/database';

export interface Team {
  id: number;
  name: string;
  sport_id: number;
  sport_name?: string;
  logo_url?: string;
  created_at?: string;
}


async function getAllTeams(): Promise<Team[]> {
  const db = getDatabase();

  const query = `
      SELECT 
        t.id,
        t.name,
        t.sport_id,
        s.name as sport_name,
        t.logo_url,
        t.created_at
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      ORDER BY s.name, t.name ASC
    `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Team[]);
      }
    });
  });
}

async function getTeamById(id: number): Promise<Team | null> {
  const db = getDatabase();

  const query = `
      SELECT 
        t.id,
        t.name,
        t.sport_id,
        s.name as sport_name,
        t.logo_url,
        t.created_at
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      WHERE t.id = ?
    `;

  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? (row as Team) : null);
      }
    });
  });
}

async function getTeamsBySport(sportId: number): Promise<Team[]> {
  const db = getDatabase();

  const query = `
      SELECT 
        t.id,
        t.name,
        t.sport_id,
        s.name as sport_name,
        t.logo_url,
        t.created_at
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      WHERE t.sport_id = ?
      ORDER BY t.name ASC
    `;

  return new Promise((resolve, reject) => {
    db.all(query, [sportId], (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Team[]);
      }
    });
  });
}

async function getTeamsBySportName(sportName: string): Promise<Team[]> {
  const db = getDatabase();

  const query = `
      SELECT 
        t.id,
        t.name,
        t.sport_id,
        s.name as sport_name,
        t.logo_url,
        t.created_at
      FROM teams t
      JOIN sports s ON t.sport_id = s.id
      WHERE LOWER(s.name) = LOWER(?)
      ORDER BY t.name ASC
    `;

  return new Promise((resolve, reject) => {
    db.all(query, [sportName], (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Team[]);
      }
    });
  });
}

const team = {
  getAllTeams,
  getTeamById,
  getTeamsBySport,
  getTeamsBySportName
}

export default team;
