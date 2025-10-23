import { faker } from '@faker-js/faker';
import user from '../models/User';

export interface MockUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface MockTeam {
  id: number;
  name: string;
  sport_id: number;
  logo_url?: string;
}

export interface MockMatch {
  id: number;
  sport_id: number;
  home_team_id: number;
  away_team_id: number;
  match_date: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  home_score: number;
  away_score: number;
}

export interface MockSport {
  id: number;
  name: string;
  description: string;
}

export const mockSports: MockSport[] = [
  { id: 1, name: 'Football', description: 'American Football' },
  { id: 2, name: 'Basketball', description: 'Basketball' },
  { id: 3, name: 'Soccer', description: 'Association Football' }
];

export async function generateMockUsers(): Promise<MockUser[]> {
  const users: MockUser[] = [];

  users.push({
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password_hash: await user.hash('admin'),
    created_at: new Date().toISOString(),
  });

  for (let i = 2; i <= 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    users.push({
      id: i,
      username: faker.internet.username({ firstName, lastName }),
      email: faker.internet.email({ firstName, lastName }),
      password_hash: await user.hash('password'),
      created_at: faker.date.past({ years: 2 }).toISOString(),
    });
  }

  return users;
}

export const mockTeams: MockTeam[] = [
  { id: 1, name: 'Kansas City Chiefs', sport_id: 1, logo_url: 'https://example.com/chiefs.png' },
  { id: 2, name: 'Buffalo Bills', sport_id: 1, logo_url: 'https://example.com/bills.png' },
  { id: 3, name: 'Dallas Cowboys', sport_id: 1, logo_url: 'https://example.com/cowboys.png' },
  { id: 4, name: 'Green Bay Packers', sport_id: 1, logo_url: 'https://example.com/packers.png' },

  { id: 5, name: 'Los Angeles Lakers', sport_id: 2, logo_url: 'https://example.com/lakers.png' },
  { id: 6, name: 'Boston Celtics', sport_id: 2, logo_url: 'https://example.com/celtics.png' },
  { id: 7, name: 'Golden State Warriors', sport_id: 2, logo_url: 'https://example.com/warriors.png' },
  { id: 8, name: 'Miami Heat', sport_id: 2, logo_url: 'https://example.com/heat.png' },

  { id: 9, name: 'Manchester City', sport_id: 3, logo_url: 'https://example.com/mancity.png' },
  { id: 10, name: 'Arsenal', sport_id: 3, logo_url: 'https://example.com/arsenal.png' },
  { id: 11, name: 'Liverpool', sport_id: 3, logo_url: 'https://example.com/liverpool.png' },
  { id: 12, name: 'Chelsea', sport_id: 3, logo_url: 'https://example.com/chelsea.png' }
];

function createGameDate(daysFromToday: number, hour: number, minute: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const mockMatches: MockMatch[] = [
  {
    id: 1,
    sport_id: 1,
    home_team_id: 1,
    away_team_id: 2,
    match_date: createGameDate(0, 20, 0), // Today at 8:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 2,
    sport_id: 1,
    home_team_id: 3,
    away_team_id: 4,
    match_date: createGameDate(1, 18, 30), // Tomorrow at 6:30 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 3,
    sport_id: 1,
    home_team_id: 2,
    away_team_id: 3,
    match_date: createGameDate(2, 21, 0), // Day after tomorrow at 9:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 4,
    sport_id: 2,
    home_team_id: 5,
    away_team_id: 6,
    match_date: createGameDate(3, 19, 30), // 3 days from now at 7:30 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 5,
    sport_id: 2,
    home_team_id: 7,
    away_team_id: 8,
    match_date: createGameDate(4, 22, 0), // 4 days from now at 10:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 6,
    sport_id: 2,
    home_team_id: 6,
    away_team_id: 7,
    match_date: createGameDate(5, 20, 0), // 5 days from now at 8:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 7,
    sport_id: 3,
    home_team_id: 9,
    away_team_id: 10,
    match_date: createGameDate(6, 15, 0), // 6 days from now at 3:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 8,
    sport_id: 3,
    home_team_id: 11,
    away_team_id: 12,
    match_date: createGameDate(7, 17, 30), // 7 days from now at 5:30 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 9,
    sport_id: 3,
    home_team_id: 10,
    away_team_id: 11,
    match_date: createGameDate(8, 20, 0), // 8 days from now at 8:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  },
  {
    id: 10,
    sport_id: 3,
    home_team_id: 12,
    away_team_id: 9,
    match_date: createGameDate(9, 16, 0), // 9 days from now at 4:00 PM
    status: 'scheduled',
    home_score: 0,
    away_score: 0
  }
];

export const getAllMockData = () => ({
  sports: mockSports,
  teams: mockTeams,
  matches: mockMatches
});

export const getMockDataBySport = (sportName: string) => {
  const sport = mockSports.find(s => s.name.toLowerCase() === sportName.toLowerCase());
  if (!sport) return null;

  const teams = mockTeams.filter(t => t.sport_id === sport.id);
  const matches = mockMatches.filter(m => m.sport_id === sport.id);

  return {
    sport,
    teams,
    matches
  };
};

export const getMockMatchesByStatus = (status: 'scheduled' | 'in_progress' | 'completed') => {
  return mockMatches.filter(m => m.status === status);
};

export const getMockMatchById = (id: number) => {
  return mockMatches.find(m => m.id === id);
};