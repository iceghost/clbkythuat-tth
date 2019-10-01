import { pool } from './pool';

// arg: {id: ... or pass: ...}
const getESP = (arg) => {
  return new Promise(function (resolve, reject) {
    const espId = arg.pass;
    // const socketId = arg.socketId;
    const userId = arg.userId;
    pool.query('SELECT * from online_esps WHERE esp_id = $1', [espId])
      .then(res => {
        if (res.rowCount) {
          const socketId = res.rows[0].socket_id;
          pool.query('SELECT * from logs WHERE socket_id = $1', [socketId])
            .then((res) => {
              const logs = res.rows;
              resolve({ pass: espId, id: socketId, log: logs });
            })
            .catch(e => console.error(e));
        } else resolve(null);
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
};

// arg: espId
const addESP = (arg) => {
  const socketId = arg.id;
  const espId = arg.pass;
  // Delete old ESP
  pool.query('DELETE FROM online_esps WHERE esp_id = $1', [espId])
    .catch(e => console.error(e));
  // Add new ESP
  pool.query('INSERT INTO online_esps(socket_id, esp_id) VALUES ($1, $2)', [socketId, espId])
    .catch(e => console.error(e));
};

const delESP = (arg) => {
  const socketId = arg.id;
  pool.query('DELETE FROM online_esps WHERE socket_id = $1', [socketId])
    .catch(e => console.error(e));
};

const clearOnlineESPs = () => {
  pool.query('TRUNCATE TABLE online_esps')
    .catch(e => console.error(e));
};

const addLog = (arg) => {
  const socketId = arg.socketId;
  const log = arg.data;
  const date = new Date();
  pool.query('INSERT INTO logs(socket_id, timestamp, log) VALUES($1, now(), $2)', [socketId, log])
    .catch(e => console.error(e));
};

const clearLogs = () => {
  pool.query('TRUNCATE TABLE logs')
    .catch(e => console.error(e));
};

module.exports = {
  get: getESP,
  add: addESP,
  del: delESP,
  clearOnline: clearOnlineESPs,
  addLog: addLog,
  clearLogs: clearLogs
};
