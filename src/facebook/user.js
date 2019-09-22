const client = require('../db/client')

const addFacebookUser = (userId, password) => {
    client.connect();
    client.query(`
        INSERT INTO facebook_users(fb_id, password) VALUES($1, $2);
    `, [userId, password])
        .then(res => {
            console.log(res);
        })
        .catch(e => console.error(e.stack))
    ;
}

module.exports = addFacebookUser;