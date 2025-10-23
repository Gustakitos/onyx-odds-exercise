import { getDatabase } from '../config/database';
import { mockSports, mockTeams, mockMatches, generateMockUsers } from './mockData';

export async function seedDatabaseWithMockData(): Promise<void> {
  const db = getDatabase();
  const mockUsers = await generateMockUsers();

  return new Promise((resolve, reject) => {

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      try {
        const insertSport = db.prepare(`
          INSERT OR REPLACE INTO sports (id, name, description) 
          VALUES (?, ?, ?)
        `);

        const insertTeam = db.prepare(`
          INSERT OR REPLACE INTO teams (id, name, sport_id, logo_url) 
          VALUES (?, ?, ?, ?)
        `);

        const insertMatch = db.prepare(`
          INSERT OR REPLACE INTO matches (id, sport_id, home_team_id, away_team_id, match_date, status, home_score, away_score) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertUser = db.prepare(`
          INSERT OR REPLACE INTO users (id, username, email, password_hash)
          VALUES (?,?,?,?)
          `)

        mockSports.forEach(sport => {
          insertSport.run(sport.id, sport.name, sport.description);
        });

        mockTeams.forEach(team => {
          insertTeam.run(team.id, team.name, team.sport_id, team.logo_url);
        });

        mockMatches.forEach(match => {
          insertMatch.run(
            match.id,
            match.sport_id,
            match.home_team_id,
            match.away_team_id,
            match.match_date,
            match.status,
            match.home_score,
            match.away_score
          );
        });

        mockUsers.forEach(user => {
          insertUser.run(user.id, user.username, user.email, user.password_hash)
        })

        insertSport.finalize();
        insertTeam.finalize();
        insertMatch.finalize();

        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            db.run('ROLLBACK');
            reject(err);
          } else {
            console.log('Successful database seed');
            resolve();
          }
        });

      } catch (error) {
        console.error('Error seeding database:', error);
        db.run('ROLLBACK');
        reject(error);
      }
    });
  });
}

export async function clearMockData(): Promise<void> {
  const db = getDatabase();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const clearQueries = [
        'DELETE FROM predictions',
        'DELETE FROM matches',
        'DELETE FROM teams',
        'DELETE FROM sports WHERE id IN (1, 2, 3)'
      ];

      let completed = 0;
      const total = clearQueries.length;

      clearQueries.forEach(query => {
        db.run(query, (err) => {
          if (err) {
            console.error(`Error executing query: ${query}`, err);
            db.run('ROLLBACK');
            reject(err);
            return;
          }

          completed++;
          if (completed === total) {
            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                console.error('Error committing clear transaction:', commitErr);
                reject(commitErr);
              } else {
                console.log('Mock data cleared successfully');
                resolve();
              }
            });
          }
        });
      });
    });
  });
}

export async function resetMockData(): Promise<void> {
  await clearMockData();
  await seedDatabaseWithMockData();
}