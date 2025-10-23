import { getDatabase } from '../config/database';

export interface Sport {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

async function getAllSports(): Promise<Sport[]> {
  const db = getDatabase();

  const query = `
      SELECT id, name, description, created_at
      FROM sports
      ORDER BY name ASC
    `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Sport[]);
      }
    });
  });
}

async function getSportById(id: number): Promise<Sport | null> {
  const db = getDatabase();

  const query = `
      SELECT id, name, description, created_at
      FROM sports
      WHERE id = ?
    `;

  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? (row as Sport) : null);
      }
    });
  });
}

async function getSportByName(name: string): Promise<Sport | null> {
  const db = getDatabase();

  const query = `
      SELECT id, name, description, created_at
      FROM sports
      WHERE LOWER(name) = LOWER(?)
    `;

  return new Promise((resolve, reject) => {
    db.get(query, [name], (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? (row as Sport) : null);
      }
    });
  });
}

const sport = {
  getAllSports,
  getSportById,
  getSportByName
}

export default sport