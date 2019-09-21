const onSearch = (data) => {
    var index = ESPs.map(value => value.pass).indexOf(data);
    if (index >= 0) {
        socket.emit('ket-qua', ESPs[index]);
    }
    else socket.emit('ket-qua', null);
}

module.exports = onSearch;