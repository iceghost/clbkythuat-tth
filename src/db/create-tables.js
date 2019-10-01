import { pool } from './pool';

pool.connect();

async function createTable () {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS connected_esp (
            id VARCHAR(32) PRIMARY KEY NOT NULL,
            socket_id VARCHAR(32) UNIQUE NOT NULL,
            log TEXT[]
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS facebook_user (
            id VARCHAR(32) PRIMARY KEY NOT NULL,
            esp_id VARCHAR(32) UNIQUE
        );
    `);
  } catch (e) { console.error(e.stack); }

  pool.end();

  console.log('Done!');
}

createTable();
