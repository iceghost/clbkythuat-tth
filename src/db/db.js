import { pool } from './pool';

export const getESP = async ({ espId, socketId, facebookId }) => {
  const query = []; // init using true values contain $1, $2, $3
  const param = [];
  if (espId) { 
    query.push('E.id = $1');
    param.push(espId);
  }
  if (socketId) {
    query.push('E.socket_id = $2');
    param.push(socketID);
  }
  if (facebookId) {
    query.push('U.id = $3');
    param.push(facebookId);
  }
  try {
    const res = await pool.query(`
      SELECT * 
      FROM connected_esp E FULL OUTER JOIN facebook_user U 
      ON E.id = U.esp_id 
      WHERE ${query.join(' AND ')};
      `, [...param]);
    return res.rows[0];
  } catch (e) { console.error(e.stack); return null; }
};

export const addESP = async ({ espId, socketId }) => {
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

export const addLog = async ({ socketId, log }) => {
  try {
  pool.query(`
    UPDATE connected_esp
    SET log = array_append(log, $2)
    WHERE socket_id = $1;
    `, [socketId, JSON.stringify({ timestamp: new Date(), content: log})]);
  } catch (e) { console.error(e.stack); }
};