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

var login = []; // Danh sách những arduino đăng nhập, login[...].id = id của socket
// Nếu pass bị trùng thì hỏng hết :))

io.on("connection", (socket) => {
  // Arduino đăng nhập tại đây
  socket.emit('Hello', {data: 'hello', id: 0})
  socket.on('dang-nhap', (data) => {
    // console.log('Login from ' + socket.id)
    login.forEach((item, index) => {
        if (item.pass == data){
          login.splice(index, 1);
        }
    });
    login.push({pass: data, id: socket.id})
  });

  socket.on('gui-lenh', (data) => {
    // console.log('Sending message:');
    // console.log(data.value);
    // console.log(' to ' + login[data.pass]);
    let id = '';
    login.forEach((item, index) => {
      if (item.pass = data.pass){
        id = item.id;
      }
    });
    socket.broadcast.to(id).emit('gui-lenh', data.value); // gửi đến socket có id trong JSON login
  });

  socket.on('disconnect', () => {
    login.forEach((item, index) => {
      if (item.id == socket.id){
        login.splice(index, 1);
      }
    })
  });
});

server.listen(PORT, () => console.log(`Example app listening on port 3000! IP Address:  ${ip.address()}`));
