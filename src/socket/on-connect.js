const { getESP, addESP, delESP, addLog } = require('../esp/esps')

const onConnect = (socket) => {
    // Arduino đăng nhập tại đây
    socket.on('dang-nhap', (pass) => {
        addESP({id: socket.id, pass: pass});
        console.log('Added')
    });
    // socket.on('gui-lenh', require('./send-command'));
    socket.on('tim-nguoi-than', (pass) => {
        getESP({pass: pass})
        .then((res) => {
            socket.emit('ket-qua', res)
        })
    });
    // socket.on('log', (data) => addLog());
    socket.on('disconnect', () => delESP({id: socket.id}));
};

module.exports = onConnect;