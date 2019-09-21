// Enviroment variables
const dotenv = require('dotenv').config();
const ip = require('ip');

const app = require('./index')
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

var ESPs = []; // Danh sách những arduino đăng nhập, ESPs[...].id = id của socket
// Nếu pass bị trùng thì hỏng hết :))

io.on("connection", (socket) => {
  // Arduino đăng nhập tại đây
  socket.on('dang-nhap', (data) => {
    // console.log('ESPs from ' + socket.id)
    var index = ESPs.map(value => value.pass).indexOf(data);
    if (index >= 0) {
      ESPs.splice(index, 1);
    }
    ESPs.push({
      pass: data.toString(),
      id: socket.id,
      log: [],
    });
  });

  socket.on('gui-lenh', (data) => {
    console.log(data)
    var index = ESPs.map(value => value.pass).indexOf(data.pass);
    if (index >= 0) {
      socket.broadcast.to(ESPs[index].id).emit('gui-lenh', data.value); // gửi đến socket có id trong JSON ESPs
    }
  });

  socket.on('disconnect', () => {
    var index = ESPs.map(value => value.id).indexOf(socket.id);
    if (index >= 0) {
      ESPs.splice(index, 1);
    }
  });

  socket.on('tim-nguoi-than', (data) => {
    var index = ESPs.map(value => value.pass).indexOf(data);
    if (index >= 0) {
      socket.emit('ket-qua', ESPs[index]);
    }
    else socket.emit('ket-qua', null);
  });

  socket.on('log', (data) => {
    var index = ESPs.map(value => value.id).indexOf(socket.id); // tìm số thứ tự của esp8266 trong mảng ESPs
    if (index >= 0) {
      var now = new Date();
      ESPs[index].log.push({ time: now, content: data });
    }
  });
});

server.listen(PORT, () => console.log(`Example app listening on port 3000! IP Address:  ${ip.address()}`));