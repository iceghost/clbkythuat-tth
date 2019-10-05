import fetch from 'node-fetch';

const sendIndicator = (userId, indicator) => {
  return fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        recipient: {
          id: userId
        },
        sender_action: indicator
      })
    }
  );
};

export default sendIndicator;
