import { DATABASE_URL, DATABASE_SSL } from '../config';

import { Pool } from 'pg';

export default new Pool({
  connectionString: DATABASE_URL,
  ssl: !(DATABASE_SSL)
});
