const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const ip = require('ip');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(express.static("./public"));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.get('/', (req, res) => {
  res.render('new');
});

app.get('/guide', (req, res) => {
  res.render('guide');
});

// Adds support for GET requests to our webhook
app.get('/facebook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "iot-bot"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for our webhook 
app.post('/facebook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

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