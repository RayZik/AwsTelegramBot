const nodeFetch = require('node-fetch');

const botApi = 'https://api.telegram.org/bot1256321612:AAELWoQLNz1ztdVlpCgF1SGZUO_oUiSjMp0';


async function sendMessage({ chatId, text }) {
  const params = new URLSearchParams({
    chat_id: chatId,
    text: `You said: ${text}`
  });

  await nodeFetch(`${botApi}/sendMessage?${params}`, {
    method: 'GET'
  });
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const { chat, text } = body.message;

  try {
    await sendMessage({
      chatId: chat.id,
      text
    })
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
  };
};
