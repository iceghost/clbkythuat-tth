const dotenv = require('dotenv').config(); // Enviroment variables
const ip = require('ip');

const PORT = process.env.PORT || 3000;

const app = require('./index')
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on("connection", require('./socket/on-connect'));

const esp = require('./esp/esp');
esp.clearOnline();
esp.clearLogs();

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}! IP Address:  ${ip.address()}`));