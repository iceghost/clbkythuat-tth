const dotenv = require('dotenv').config();

const client = require('./client')

client.connect();

client.query(`
        CREATE TABLE online_esps (
            esp_id VARCHAR(32) UNIQUE,
            socket_id VARCHAR(32) PRIMARY KEY UNIQUE
        );
    `)
    .catch(e => console.error(e.stack))
    ;

client.query(`
        CREATE TABLE fb_users (
            fb_id VARCHAR(32) PRIMARY KEY UNIQUE,
            esp_id VARCHAR(32) UNIQUE
        );
    `)
    .catch(e => console.error(e.stack))
    ;

client.query(`
        CREATE TABLE logs (
            esp_id VARCHAR(32) PRIMARY KEY UNIQUE,
            timestamp TIMESTAMPTZ,
            log TEXT
        );
    `)
    .catch(e => console.error(e.stack))
    ;