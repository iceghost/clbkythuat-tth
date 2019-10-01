const sendMessage = require('./send-message');
const user = require('../db/user');
const esp = require('../db/esp');
const socket = require('socket.io-client')(`http://${process.env.SOCKET_HOST}`);

const replyMessage = (req, res) => {
  const body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhookEvent = entry.messaging[0];
      const sender = webhookEvent.sender.id;
      const message = webhookEvent.message.text;
      const { command, argument } = message.trim().split(/[\n ]+/); // tách khoảng trắng dùng regex
      switch (command) {
        case 'send':
          // console.log(webhookEvent);
          user.get({ id: sender })
            .then(res => {
              if (res) {
                const espId = res.pass;
                esp.get({ pass: res.pass })
                  .then(res => {
                    if (res) {
                      // io.sockets.to(res.id).emit('gui-lenh', { lenh: 'guilenh', giatri: argument, }); // gửi đến socket có id trong JSON ESPs
                      // emitToId(res.id, 'gui-lenh', { lenh: 'guilenh', giatri: argument, });
                      socket.emit('gui-lenh', { pass: espId, value: { lenh: 'guilenh', giatri: argument } });
                      sendMessage(sender, `Đã gửi lệnh ${argument} cho ESP của bạn`);
                    } else sendMessage(sender, 'ESP của bạn không online');
                  })
                  .catch(e => console.log(e));
              } else sendMessage(sender, 'Vui lòng đặt mật khẩu bằng lệnh "pass <pass>"');
            })
            .catch(e => console.log(e));

          break;

        case 'help': {
          const reply = 'Các lệnh hiện có:\n' +
            '1. pass <pass>\nGắn mật khẩu <pass> cho tài khoản FB này\n' +
            '2. send <cmd>\nGửi lệnh <cmd> cho ESP có mật khẩu <pass> được đặt ở trên\n' +
            '3. help\nMở menu hướng dẫn\n' +
            '4. info\nThông tin về bot\n';
          sendMessage(sender, reply);
          break;
        }

        case 'pass': {
          const password = argument;
          user.add({ id: sender, pass: password });
          sendMessage(sender, 'Đã đặt mật khẩu');
          break;
        }

        case 'info': {
          const reply = 'Bot dùng để điều khiển các ESP thông qua Messenger ' +
            'với website chính là https://tanthongiot.herokuapp.com. ' +
            'Mọi thắc mắc, góp ý xin gửi về fb.com/iceghost.tth. ' +
            'Chúc bạn có trải nghiệm vui vẻ cùng với IOT bot!';
          sendMessage(sender, reply);
          break;
        }

        default:
          sendMessage(sender, 'Sai cú pháp. Gõ "help" để biết danh sách các lệnh');
          break;
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

module.exports = replyMessage;
