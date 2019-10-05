import pool from './pool';

const clearESP = async () => {
  await pool.query('TRUNCATE TABLE connected_esp');
};

export default clearESP;
