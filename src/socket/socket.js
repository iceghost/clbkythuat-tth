const mount = (server) => {
    const io = require('socket.io')(server);
    io.on("connection", require('./on-connect'));

    module.exports.io = io;
}

module.exports.mount = mount;