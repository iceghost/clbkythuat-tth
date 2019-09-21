const client = require('../db/client');

client.connect();

// arg: {id: ... or pass: ...}
const getESP = (arg) => {
    const espId = arg.pass;
    return new Promise(function (resolve, reject) {
        client.query('SELECT * from online_esps WHERE esp_id = $1', [espId])
            .then((res) => {
                if (res.rowCount) {
                    client.query('SELECT log from logs WHERE esp_id = $1', [espId])
                        .then((res) => {
                            resolve({ log: res.rows.map(ele => ele.log) });
                            // return { pass: result.esp_id, id: result.socket_id, log: logs };
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
    client.query('DELETE FROM online_esps WHERE esp_id = $1', [espId])
        .catch((e) => console.error(e));
    // Add new ESP
    client.query('INSERT INTO online_esps(socket_id, esp_id) VALUES ($1, $2)', [socketId, espId])
        .catch((e) => console.error(e));
}

const delESP = (arg) => {
    const socketId = arg.id;
    client.query('DELETE FROM online_esps WHERE socket_id = $1', [socketId])
        .catch((e) => console.error(e));
}

const clearOnlineESPs = () => {
    client.query('TRUNCATE TABLE online_esps')
        .catch((e) => console.error(e));
}

const addLog = (arg) => {
    const espId = arg.pass;
    const log = arg.data;
    client.query('INSERT INTO logs(esp_id, timestamp, log) VALUES($1, to_timestamp($2), $3)', [espId, Date.now(), log])
    .catch((e) => console.error(e))
}

module.exports = {
    getESP: getESP,
    addESP: addESP,
    delESP: delESP,
    clearOnlineESPs: clearOnlineESPs,
    addLog: addLog,
}