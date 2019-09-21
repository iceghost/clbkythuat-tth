const sendCommand = (data) => {
    console.log(data)
    var index = ESPs.map(value => value.pass).indexOf(data.pass);
    if (index >= 0) {
        socket.broadcast.to(ESPs[index].id).emit('gui-lenh', data.value); // gửi đến socket có id trong JSON ESPs
    }
}

module.exports = sendCommand;