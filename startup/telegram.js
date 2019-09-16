const registerUser = require('../middleware/telegraf/registerUser');
const winston = require('winston');
const session = require('telegraf/session');

module.exports = function(bot) {
    bot.use(registerUser);
    bot.use(session());

    bot.start((ctx) => ctx.reply('Olá! Para começar use /lesgo c:'));
    bot.catch((err) => {
        winston.error('Error',err);
    })    
    bot.launch();
}