const writeLogs = (data) => {
    var index = ESPs.map(value => value.id).indexOf(socket.id); // tìm số thứ tự của esp8266 trong mảng ESPs
    if (index >= 0) {
        var now = new Date();
        ESPs[index].log.push({ time: now, content: data });
    }
}

module.exports = writeLogs;