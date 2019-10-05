import pool from './pool';

const addFacebookUser = async ({ userId, espId }) => {
  try {
    await pool.query(`
        INSERT INTO facebook_user(id, esp_id) 
        VALUES ($1, $2)
        ON CONFLICT (id)
        DO UPDATE SET esp_id = EXCLUDED.esp_id;
      `, [userId, espId]);
  } catch (e) { console.error(e.stack); }
};

export default addFacebookUser;
