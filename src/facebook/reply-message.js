const sendMessage = require('./send-message');
const user = require('./user');
const esp = require('../esp/esp');
const socket = require('socket.io-client')(`http://${process.env.SOCKET_HOST}`)

const replyMessage = (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            const sender = webhook_event.sender.id;
            const message = webhook_event.message.text;
            const s_message = message.trim().split(/[\n ]+/); // tách khoảng trắng dùng regex
            switch (s_message[0]) {
                case 'send':
                    // console.log(webhook_event);
                    user.get({ id: sender })
                        .then(res => {
                            if (res) {
                                const espId = res.pass;
                                esp.get({ pass: res.pass })
                                    .then(res => {
                                        if (res) {
                                            // io.sockets.to(res.id).emit('gui-lenh', { lenh: 'guilenh', giatri: s_message[1], }); // gửi đến socket có id trong JSON ESPs
                                            // emitToId(res.id, 'gui-lenh', { lenh: 'guilenh', giatri: s_message[1], });
                                            socket.emit('gui-lenh', { pass: espId, value: { lenh: 'guilenh', giatri: s_message[1], } })
                                            sendMessage(sender, `Đã gửi lệnh ${s_message[1]} cho ESP của bạn`);
                                        }
                                        else sendMessage(sender, 'ESP của bạn không online');
                                    })
                                    .catch(e => console.log(e))
                            }
                            else sendMessage(sender, `Vui lòng đặt mật khẩu bằng lệnh "pass <pass>"`);
                        })
                        .catch(e => console.log(e));

                    break;

                case 'help':
                    reply = "Các lệnh hiện có:\n" +
                        "1. pass <pass>\nGắn mật khẩu <pass> cho tài khoản FB này\n" +
                        "2. send <cmd>\nGửi lệnh <cmd> cho ESP có mật khẩu <pass> được đặt ở trên\n" +
                        "3. help\nMở menu hướng dẫn\n" +
                        "4. info\nThông tin về bot\n";
                    sendMessage(sender, reply);

                    break;

                case 'pass':
                    const password = s_message[1];
                    user.add({ id: sender, pass: password });
                    sendMessage(sender, "Đã đặt mật khẩu");
                    break;

                case 'info':
                    reply = "Bot dùng để điều khiển các ESP thông qua Messenger " +
                        "với website chính là https://tanthongiot.herokuapp.com. " +
                        "Mọi thắc mắc, góp ý xin gửi về fb.com/iceghost.tth. " +
                        "Chúc bạn có trải nghiệm vui vẻ cùng với IOT bot!";
                    sendMessage(sender, reply);
                    break;

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