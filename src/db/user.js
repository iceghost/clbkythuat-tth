const pool = require('../db/pool');

const addFacebookUser = (arg) => {
  const userId = arg.id;
  const espId = arg.pass;
  getESP({ id: userId })
    .then(res => {
      let query;
      if (res) query = 'UPDATE fb_users SET esp_id = $2 WHERE fb_id = $1';
      else query = 'INSERT INTO fb_users(fb_id, esp_id) VALUES($1, $2)';
      pool.query(query, [userId, espId])
        .catch(e => console.error(e.stack));
    })
    .catch(e => console.error(e.stack));
};

const getESP = (arg) => {
  return new Promise((resolve, reject) => {
    const userId = arg.id;
    pool.query('SELECT * FROM fb_users WHERE fb_id = $1', [userId])
      .then(res => {
        if (res.rowCount) { resolve({ id: userId, pass: res.rows[0].esp_id }); } else resolve(null);
      })
      .catch(e => {
        console.error(e.stack);
        reject(e);
      });
  });
};

module.exports = {
  add: addFacebookUser,
  get: getESP
};
