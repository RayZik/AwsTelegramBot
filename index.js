const config = require('./config');
const BotApi = require('node-telegram-bot-api');
const Bot = new BotApi(config.apiToken);


function random(min, max) {
  min = Number(min);
  max = Number(max);

  return Math.floor(Math.random() * (max + 1 - min) + min)
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  if (body.message) {
    const { chat: { id: chatId }, text, reply_to_message } = body.message;

    if (!reply_to_message) {
      await Bot.sendMessage(chatId, 'Choose:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Min/Max',
                callback_data: 'minmax'
              },
              {
                text: 'Range',
                callback_data: 'range'
              }
            ],
          ]
        }
      });
    } else {

      switch (true) {
        case /^\[range\]/g.test(reply_to_message.text):
          // before: 1 2 3 4, after [1, 2, 3, 4]
          const items = text.replace(/ /g, ' ').split(' ');

          if (items.length !== 0) {
            const randomItem = items[Math.floor(Math.random() * items.length)];

            await Bot.sendMessage(chatId, String(randomItem));
          }

          break;

        case /^\[minmax\]/g.test(reply_to_message.text):
          // before: 1 2, after [1, 2]
          const [min, max] = text.replace(/ /g, ' ').split(' ');

          if (min && max) {
            await Bot.sendMessage(chatId, String(random(min, max)));
          }

          break;
      }

    }
  } else if (body.callback_query) {

    const { data, message } = body.callback_query;


    switch (data) {
      case 'range':

        await Bot.sendMessage(
          message.chat.id,
          '[range] Enter your values with space (1 2 3 4). Replay to this message.',
          {
            reply_to_message_id: message.message_id
          }
        );

        break;

      case 'minmax':

        await Bot.sendMessage(
          message.chat.id,
          '[minmax] Enter min and max value with space (1 2). Replay to this message.',
          {
            reply_to_message_id: message.message_id
          }
        );

        break;
    }

  }


  return {
    statusCode: 200,
  };
};
