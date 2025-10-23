import bcryptjs from "bcryptjs";

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;

  created_at: string;
  updated_at: string;
}

async function hash(password: string) {
  if (password === null || password === undefined || typeof password !== 'string') {
    throw new Error('Password must be a valid string');
  }

  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

async function compare(providedPassword: string, storedPassword: string) {
  if (providedPassword === null || providedPassword === undefined ||
    storedPassword === null || storedPassword === undefined ||
    typeof providedPassword !== 'string' || typeof storedPassword !== 'string') {
    return false;
  }

  try {
    return await bcryptjs.compare(providedPassword, storedPassword);
  } catch (error) {
    return false;
  }
}

const user = {
  hash,
  compare
}

export default user;
