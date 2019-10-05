import pool from './pool';

const removeESP = async ({ socketId }) => {
  try {
    await pool.query(`
      DELETE FROM connected_esp
      WHERE socket_id = $1;
      `, [socketId]);
    console.log(`Removed ${socketId}`);
  } catch (e) { console.error(e.stack); }
};

export default removeESP;
