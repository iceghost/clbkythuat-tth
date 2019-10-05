import pool from './pool';

const addLog = async ({ socketId, log }) => {
  try {
    await pool.query(`
      UPDATE connected_esp
      SET log = array_append(log, $2)
      WHERE socket_id = $1;
      `, [socketId, JSON.stringify({ timestamp: new Date(), content: log })]);
  } catch (e) { console.error(e.stack); }
};

export default addLog;
