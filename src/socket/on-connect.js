import { getESP, addESP, addLog } from '../db/db';

const onConnect = (socket) => {
  // Arduino đăng nhập tại đây
  socket.on('dang-nhap', async (pass) => {
    await addESP({ socketId: socket.id, espId: pass });
    console.log('Added');
  });

  socket.on('gui-lenh', async ({ pass, value }) => {
    console.log(value);
    const esp = await getESP({ espId: pass });
    if (esp) {
      socket.broadcast.to(esp.socket_id).emit('gui-lenh', value);
    }
  });

  socket.on('tim-nguoi-than', async (pass) => {
    if (pass) {
      const esp = await getESP({ espId: pass });
      socket.emit('ket-qua', esp);
    }
    else socket.emit('ket-qua', null);
  });

  socket.on('log', (data) => { addLog({ socketId: socket.id, log: data }); });
  // socket.on('disconnect', () => esps.del({ id: socket.id }));
};

module.exports = onConnect;
