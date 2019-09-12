const express = require('express');
const winston = require('winston');
const app = express();

const config = require('config');
const router = express.Router();
const Telegraf = require('telegraf/telegraf');
const bot = new Telegraf(config.get('token'));
const {User} = require('./models/user.model');

bot.on('message', async (obj) => {
    obj = obj.update.message;
    let user = {
        nome: `${obj.from.first_name} + ${obj.from.last_name}`,
        chatId: obj.chat.id                
    }
    user = new User(user);
    let userFromDb = await User.findOne({chatId: user.chatId});
    if (userFromDb) {
        console.log('user already exists!');
        return;
    }
    await user.save();
    console.log('user saved!');
})

require('./startup/logging')();
require('./startup/database')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Api rodando na porta ${port}`));
bot.startPolling();

module.exports = server;

