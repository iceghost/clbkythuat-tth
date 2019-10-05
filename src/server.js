import { PORT } from './config';
import ip from 'ip';

import app from './index';
import { Server } from 'http';
import SocketServer from 'socket.io';

import onConnect from './socket';
import { clearESP } from './db';

const server = Server(app);
const io = SocketServer(server);

clearESP();
io.on('connection', onConnect);

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}! IP Address:  ${ip.address()}`));
