const Telegram = require('telegraf/telegram');

module.exports = new Telegram(process.env.TOKEN);
