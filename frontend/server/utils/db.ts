import pg from 'pg';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const { Pool } = pg;

// Use a hardcoded connection string for development if DATABASE_URL is not set
const connectionString = config.dbUrl || 'postgresql://localhost:5432/digital_download';

export const pool = new Pool({
  connectionString
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Initialize database tables
export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      username VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
