import { Database } from 'sqlite3';

export interface DatabaseConfig {
  path?: string;
  memory?: boolean;
}

export interface QueryResult {
  success: boolean;
  error?: Error;
  data?: any;
}

export interface SchemaTable {
  name: string;
  schema: string;
}

export interface SeedData {
  table: string;
  data: Record<string, any>[];
}

export class DatabaseUtils {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    return new Promise((resolve) => {
      this.db.run(query, params, function (err) {
        if (err) {
          resolve({ success: false, error: err });
        } else {
          resolve({ success: true, data: { lastID: this.lastID, changes: this.changes } });
        }
      });
    });
  }

  async executeQueries(queries: string[]): Promise<QueryResult> {
    return new Promise((resolve) => {
      let completed = 0;
      const total = queries.length;
      let hasError = false;

      if (total === 0) {
        resolve({ success: true });
        return;
      }

      queries.forEach(query => {
        this.db.run(query, (err) => {
          if (err && !hasError) {
            hasError = true;
            resolve({ success: false, error: err });
            return;
          }

          completed++;
          if (completed === total && !hasError) {
            resolve({ success: true });
          }
        });
      });
    });
  }

  async createSchema(schema: string): Promise<QueryResult> {
    return new Promise((resolve) => {
      this.db.exec(schema, (err) => {
        if (err) {
          resolve({ success: false, error: err });
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  async seedData(seedData: SeedData[]): Promise<QueryResult> {
    return new Promise((resolve) => {
      let completed = 0;
      let total = 0;
      let hasError = false;

      seedData.forEach(({ data }) => {
        total += data.length;
      });

      if (total === 0) {
        resolve({ success: true });
        return;
      }

      seedData.forEach(({ table, data }) => {
        data.forEach(row => {
          const columns = Object.keys(row).join(', ');
          const placeholders = Object.keys(row).map(() => '?').join(', ');
          const values = Object.values(row);

          const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

          this.db.run(query, values, (err) => {
            if (err && !hasError) {
              hasError = true;
              resolve({ success: false, error: err });
              return;
            }

            completed++;
            if (completed === total && !hasError) {
              resolve({ success: true });
            }
          });
        });
      });
    });
  }

  async clearTables(tables: string[]): Promise<QueryResult> {
    const queries: string[] = [];

    tables.forEach(table => {
      queries.push(`DELETE FROM ${table}`);
    });

    tables.forEach(table => {
      queries.push(`DELETE FROM sqlite_sequence WHERE name='${table}'`);
    });

    return this.executeQueries(queries);
  }

  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}

export const DATABASE_SCHEMAS = {
  SPORTS: `
    CREATE TABLE IF NOT EXISTS sports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,

  TEAMS: `
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      sport_id INTEGER NOT NULL,
      logo_url VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sport_id) REFERENCES sports(id)
    )
  `,

  USERS: `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,

  MATCHES: `
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sport_id INTEGER NOT NULL,
      home_team_id INTEGER NOT NULL,
      away_team_id INTEGER NOT NULL,
      match_date DATETIME NOT NULL,
      status VARCHAR(20) DEFAULT 'scheduled',
      home_score INTEGER DEFAULT 0,
      away_score INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sport_id) REFERENCES sports(id),
      FOREIGN KEY (home_team_id) REFERENCES teams(id),
      FOREIGN KEY (away_team_id) REFERENCES teams(id)
    )
  `,

  PREDICTIONS: `
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      match_id INTEGER NOT NULL,
      predicted_winner VARCHAR(20) NOT NULL,
      predicted_home_score INTEGER,
      predicted_away_score INTEGER,
      confidence INTEGER DEFAULT 50,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
      UNIQUE(user_id, match_id)
    )
  `
};

export const TEST_SEED_DATA: SeedData[] = [
  {
    table: 'sports',
    data: [
      { name: 'Football', description: 'American Football' },
      { name: 'Basketball', description: 'Professional Basketball' }
    ]
  },
  {
    table: 'teams',
    data: [
      { name: 'Team A', sport_id: 1 },
      { name: 'Team B', sport_id: 1 },
      { name: 'Team C', sport_id: 2 },
      { name: 'Team D', sport_id: 2 }
    ]
  },
  {
    table: 'users',
    data: [
      { username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' },
      { username: 'admin', email: 'admin@example.com', password_hash: 'adminpassword' }
    ]
  },
  {
    table: 'matches',
    data: [
      { sport_id: 1, home_team_id: 1, away_team_id: 2, match_date: '2024-01-15 19:00:00', status: 'completed', home_score: 21, away_score: 14 },
      { sport_id: 2, home_team_id: 3, away_team_id: 4, match_date: '2024-01-16 20:00:00', status: 'scheduled' }
    ]
  }
];

export const TABLE_CLEAR_ORDER = ['matches', 'teams', 'sports', 'users'];

export function createDatabaseUtils(db: Database): DatabaseUtils {
  return new DatabaseUtils(db);
}

export async function initializeTestDatabase(): Promise<Database> {
  const db = new Database(':memory:');
  await setupTestDatabase(db);
  return db;
}

export async function dropTestDatabase(db: Database): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function setupTestDatabase(db: Database): Promise<void> {
  const utils = createDatabaseUtils(db);

  try {
    const schemas = [
      DATABASE_SCHEMAS.SPORTS,
      DATABASE_SCHEMAS.TEAMS,
      DATABASE_SCHEMAS.USERS,
      DATABASE_SCHEMAS.MATCHES,
      DATABASE_SCHEMAS.PREDICTIONS
    ];

    for (const schema of schemas) {
      const result = await utils.createSchema(schema);
      if (!result.success) {
        throw result.error || new Error('Failed to create database schema');
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function recreateTestDatabase(): Promise<Database> {
  try {
    const db = await initializeTestDatabase();
    await seedTestData(db);
    return db;
  } catch (error) {
    throw error;
  }
}

export async function clearTestData(db: Database): Promise<void> {
  const utils = createDatabaseUtils(db);
  const result = await utils.clearTables(TABLE_CLEAR_ORDER);

  if (!result.success) {
    throw result.error || new Error('Failed to clear test data');
  }
}

export async function seedTestData(db: Database): Promise<void> {
  const utils = createDatabaseUtils(db);
  let queries;

  for (const seedData of TEST_SEED_DATA) {
    queries = seedData.data.map(row => {
      const columns = Object.keys(row).join(', ');
      const values = Object.values(row).map(v => typeof v === 'string' ? `'${v}'` : v).join(', ');
      const query = `INSERT OR IGNORE INTO ${seedData.table} (${columns}) VALUES (${values})`;
      return query;
    });

    const result = await utils.executeQueries(queries);
    if (!result.success) {
      throw result.error || new Error(`Failed to seed ${seedData.table} data`);
    }
  }

  return new Promise((resolve, reject) => {
    db.all('SELECT COUNT(*) as count FROM matches', (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        db.all('SELECT COUNT(*) as count FROM sports', (err, sportsRows: any[]) => {
          if (err) {
            reject(err);
          } else {
            db.all('SELECT COUNT(*) as count FROM teams', (err, teamsRows: any[]) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        });
      }
    });
  });
}