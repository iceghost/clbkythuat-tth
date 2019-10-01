import { PORT } from './config';
import ip from 'ip';

const app = require('./index');
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', require('./socket/on-connect'));

// const esp = require('./db/esp');
// esp.clearOnline();
// esp.clearLogs();

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}! IP Address:  ${ip.address()}`));
