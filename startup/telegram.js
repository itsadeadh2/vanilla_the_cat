/* eslint-disable func-names */
const winston = require('winston');
const session = require('telegraf/session');
const registerUser = require('../middleware/telegraf/registerUser');
const refreshToken = require('../middleware/telegraf/refreshUserToken');

module.exports = function (bot) {
  bot.use(refreshToken);
  bot.use(registerUser);
  bot.use(session());

  bot.start((ctx) => ctx.reply('Olá! Para começar use /lesgo c:'));
  bot.catch((err) => {
    winston.error('Error', err);
  });
  bot.launch();
};
