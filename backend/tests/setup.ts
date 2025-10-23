import { Database } from 'sqlite3';
import {
  initializeTestDatabase,
  dropTestDatabase,
  recreateTestDatabase,
  seedTestData as seedTestDataUtil
} from '../src/utils/database';

export let testDb: Database;

export async function setupTestDatabase(): Promise<void> {
  try {
    testDb = await recreateTestDatabase();
  } catch (error) {
    throw error;
  }
}

export async function teardownTestDatabase(): Promise<void> {
  if (testDb) {
    try {
      await dropTestDatabase(testDb);
    } catch (error) {
    }
  }
}

export async function resetTestDatabase(): Promise<void> {
  try {
    if (testDb) {
      await dropTestDatabase(testDb);
    }
    testDb = await recreateTestDatabase();
  } catch (error) {
    throw error;
  }
}

export async function seedTestData(): Promise<void> {
  await seedTestDataUtil(testDb);
}

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});

beforeEach(async () => {
  await resetTestDatabase();
});

jest.mock('../src/config/database', () => ({
  getDatabase: () => testDb,
  initializeDatabase: jest.fn().mockResolvedValue(undefined)
}));