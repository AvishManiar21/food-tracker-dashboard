import { Pool } from 'pg';

// Create PostgreSQL connection pool
// Works with both local PostgreSQL and Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
