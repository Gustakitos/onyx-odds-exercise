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
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const user = {
  hash,
  compare
}

export default user;
