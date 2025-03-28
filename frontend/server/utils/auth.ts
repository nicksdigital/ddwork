import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';
import { query } from './db';

const config = useRuntimeConfig();
// Use a default secret for development if JWT_SECRET is not set
const JWT_SECRET = config.jwtSecret || 'development-secret-key-do-not-use-in-production';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, username?: string) {
  const hashedPassword = await hashPassword(password);
  
  // Insert user with username if provided
  const result = username 
    ? await query(
        'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id',
        [email, hashedPassword, username]
      )
    : await query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, hashedPassword]
      );
  
  return result.rows[0];
}

export async function validateUser(email: string, password: string) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  
  if (!user) {
    return null;
  }

  const validPassword = await comparePasswords(password, user.password_hash);
  if (!validPassword) {
    return null;
  }

  return user;
}
