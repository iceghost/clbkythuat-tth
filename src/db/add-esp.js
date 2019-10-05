import pool from './pool';

const addESP = async ({ espId, socketId }) => {
  try {
    // Upsert method
    await pool.query(`
        INSERT INTO connected_esp(id, socket_id, log) 
        VALUES ($1, $2, '{}')
        ON CONFLICT (id)
        DO UPDATE SET socket_id = EXCLUDED.socket_id, log = '{}';
        `, [espId, socketId]);
  } catch (e) { console.error(e.stack); }
};

export default addESP;
