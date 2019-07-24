const express = require('express');
const app = express();
const ip = require('ip');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get('/', (req, res) => {
  res.render('index');
});

var login = {}; // Danh sách những arduino đăng nhập, login[pass] = id của socket
// Nếu pass bị trùng thì hỏng hết :))

io.on("connection", (socket) => {
  // Arduino đăng nhập tại đây
  socket.on('dang-nhap', (data) => {
    login.data = socket.id;
  });

  socket.on('gui-lenh', (data) => {
    socket.broadcast.to(login[data.pass]).emit('gui-lenh', data.value); // gửi đến socket có id trong JSON login
  });
});

server.listen(PORT, () => console.log(`Example app listening on port 3000! IP Address:  ${ip.address()}`));
