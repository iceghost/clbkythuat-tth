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

app.get('/guide', (req, res) => {
  res.render('guide');
});

app.get('/voice', (req, res) => {
  res.render('voice');
})

var login = []; // Danh sách những arduino đăng nhập, login[...].id = id của socket
// Nếu pass bị trùng thì hỏng hết :))

io.on("connection", (socket) => {
  // Arduino đăng nhập tại đây
  socket.emit('Hello');
  socket.on('dang-nhap', (data) => {
    // console.log('Login from ' + socket.id)
    let index = login.map(value => value.pass).indexOf(data);
    if (index >= 0){
      login.splice(index, 1);
    }
    login.push({pass: data.toString(), id: socket.id})
    // console.log(login)
  });

  socket.on('gui-lenh', (data) => {
    // console.log('Sending message:');
    // console.log(data.value);

    let id = '';
    let index = login.map(value => value.pass).indexOf(data.pass);

    // console.log(' to ' + login[index].id);

    if (index >= 0){
      id = login[index].id;
    }
    socket.broadcast.to(id).emit('gui-lenh', data.value); // gửi đến socket có id trong JSON login
  });

  socket.on('disconnect', () => {
    let index = login.map(value => value.id).indexOf(socket.id);
    if (index >= 0){
      login.splice(index, 1);
    }
  });

  socket.on('tim-nguoi-than', (data) => {
    // console.log('tim ' + data + ' trong mang login...')
    // console.log(login.map(value => value.pass))
    if (login.map(value => value.pass).indexOf(data) >= 0){
      socket.emit('tim-thay');
    } else socket.emit('khong-tim-thay');
  });
});

server.listen(PORT, () => console.log(`Example app listening on port 3000! IP Address:  ${ip.address()}`));
