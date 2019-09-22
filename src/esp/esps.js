const pool = require('../db/pool');

// arg: {id: ... or pass: ...}
const getESP = (arg) => {
    return new Promise(function (resolve, reject) {
        const espId = arg.pass;
        pool.query('SELECT * from online_esps WHERE esp_id = $1', [espId])
            .then((res) => {
                if (res.rowCount) {
                    const socketId = res.rows[0].socket_id;
                    pool.query('SELECT log from logs WHERE esp_id = $1', [espId])
                        .then((res) => {
                            const logs = res.rows.map(ele => ele.log);
                            resolve({ pass: espId, id: socketId, log: logs });
                        })
                        .catch((e) => console.error(e))
                }
                else resolve(null);
            })
            .catch((e) => {
                console.error(e);
                reject(e);
            })
    })
}

// arg: espId
const addESP = (arg) => {
    const socketId = arg.id;
    const espId = arg.pass;
    // Delete old ESP
    pool.query('DELETE FROM online_esps WHERE esp_id = $1', [espId])
        .catch((e) => console.error(e));
    // Add new ESP
    pool.query('INSERT INTO online_esps(socket_id, esp_id) VALUES ($1, $2)', [socketId, espId])
        .catch((e) => console.error(e));
}

const delESP = (arg) => {
    const socketId = arg.id;
    pool.query('DELETE FROM online_esps WHERE socket_id = $1', [socketId])
        .catch((e) => console.error(e));
}

const clearOnlineESPs = () => {
    pool.query('TRUNCATE TABLE online_esps')
        .catch((e) => console.error(e));
}

const addLog = (arg) => {
    const espId = arg.pass;
    const log = arg.data;
    pool.query('INSERT INTO logs(esp_id, timestamp, log) VALUES($1, to_timestamp($2), $3)', [espId, Date.now(), log])
        .catch((e) => console.error(e))
}

module.exports = {
    get: getESP,
    add: addESP,
    del: delESP,
    clearOnline: clearOnlineESPs,
    addLog: addLog,
}