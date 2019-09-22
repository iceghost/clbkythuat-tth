const io = require('socket.io');
const sendMessage = require('./send-message');

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
            const s_message = message.split(' ');
            switch (s_message[0]) {
                case '/send':
                    // console.log(webhook_event);
                    var index = ESPs.map(value => value.pass).indexOf(s_message[1]);
                    if (index >= 0) {
                        io.to(ESPs[index].id).emit('gui-lenh', { lenh: 'guilenh', giatri: s_message[2], }); // gửi đến socket có id trong JSON ESPs
                        sendMessage(sender, `Đã gửi lệnh ${s_message[2]} cho ESP có mật khẩu ${s_message[1]}`);
                    }
                    else {
                        sendMessage(sender, `ESP có mật khẩu ${s_message[1]} hiện đang không online`);
                    }
                    break;

                case '/help':
                    const reply = "Các lệnh hiện có:\n\n" +
                        "1. /send <pass> <cmd>\nGửi lệnh <cmd> cho ESP có mật khẩu <pass>\n\n" +
                        "2. /help\nMở menu hướng dẫn\n\n" +
                        "Mọi thắc mắc, góp ý xin gửi về fb.com/iceghost.tth. " +
                        "Chúc bạn có trải nghiệm vui vẻ cùng với IOT bot!";
                    sendMessage(sender, reply);

                    break;
                
                case '/password':
                    const password = s_message[1];
                    addFacebookUser(sender, password);

                default:
                    sendMessage(sender, 'Sai cú pháp. Gõ /help để biết danh sách các lệnh');
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