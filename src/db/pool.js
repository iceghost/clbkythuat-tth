import { DATABASE_URL, DATABASE_SSL } from '../config';

const { Pool } = require('pg');

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: !(DATABASE_SSL)
});
