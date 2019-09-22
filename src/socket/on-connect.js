const esps = require('../esp/esps')

const onConnect = (socket) => {
    // Arduino đăng nhập tại đây
    socket.on('dang-nhap', (pass) => {
        esps.add({ id: socket.id, pass: pass });
        console.log('Added')
    });

    socket.on('gui-lenh', (data) => {
        console.log(data)
        const espId = data.pass;
        const command = data.value;
        esps.get({ pass: espId })
            .then((res) => {
                if (res) {
                    const socketId = res.id;
                    socket.broadcast.to(socketId).emit('gui-lenh', command);
                }
            });
    });

    socket.on('tim-nguoi-than', (pass) => {
        esps.get({ pass: pass })
            .then((res) => {
                socket.emit('ket-qua', res)
            })
    });
    // socket.on('log', (data) => addLog());
    socket.on('disconnect', () => esps.del({ id: socket.id }));
};

module.exports = onConnect;