import pool from './pool';

const getESP = async ({ espId, socketId, facebookId }) => {
  let query = '';
  let param = '';
  if (espId) {
    query = 'E.id = $1';
    param = espId;
  } else if (socketId) {
    query = 'E.socket_id = $1';
    param = socketId;
  } else if (facebookId) {
    query = 'U.id = $1';
    param = facebookId;
  } else return null;

  try {
    const res = await pool.query(`
      SELECT * 
      FROM connected_esp E FULL OUTER JOIN facebook_user U 
      ON E.id = U.esp_id 
      WHERE ${query};
      `, [param]);
    return res.rows[0];
  } catch (e) { console.error(e.stack); return null; }
};

export default getESP;
