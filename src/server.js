const dotenv = require('dotenv').config(); // Enviroment variables
const ip = require('ip');

const PORT = process.env.PORT || 3000;

const app = require('./index')
const server = require('http').Server(app);
require('./socket/socket').mount(server);

require('./esp/esps').clearOnline();

server.listen(PORT, () => console.log(`Example app listening on port 3000! IP Address:  ${ip.address()}`));