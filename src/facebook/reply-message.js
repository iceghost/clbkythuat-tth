import { getESP, addFacebookUser } from '../db';
import sendMessage from './send-message';
import sendIndicator from './send-indicator';

import SocketClient from 'socket.io-client';

const socket = SocketClient(`http://${process.env.SOCKET_HOST}`);

const replyMessage = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        const webhookEvent = entry.messaging[0];
        console.log(webhookEvent)
        const sender = webhookEvent.sender.id;
        const message = webhookEvent.message.text;
        const [command, argument] = message.trim().toLowerCase().split(/[\n ]+/); // tách khoảng trắng dùng regex

        sendIndicator(sender, 'mark_seen')
        sendIndicator(sender, 'typing_on')
        switch (command) {
          case 'send': {
            const result = await getESP({ facebookId: sender });
            console.log(result)
            if (result) {
              if (result.socket_id) {
                socket.emit('gui-lenh', { pass: result.esp_id, value: { lenh: 'guilenh', giatri: argument } });
                sendMessage(sender, `Đã gửi lệnh ${argument} cho ESP của bạn.`);
              } else sendMessage(sender, 'ESP của bạn hiện không online.');

            } else sendMessage(sender, 'Vui lòng đặt mật khẩu bằng lệnh "pass <pass>"');
            break;
          }

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
            await addFacebookUser({ userId: sender, espId: argument });
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
      }

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }
  catch (e) { console.log(e.stack) }
};

export default replyMessage;
