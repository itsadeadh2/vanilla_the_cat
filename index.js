const express = require('express');
const winston = require('winston');
const app = express();

const config = require('config');
const router = express.Router();
const Telegraf = require('telegraf/telegraf');
const bot = new Telegraf(config.get('token'));
const {User} = require('./models/user.model');

bot.use((ctx, next) => {
    const userId = ctx.message.from.id;
    let userFromDb = await User.findOne({chatId: user.chatId});
    let user = {
        nome: // cansei, fica pra amanha
    }
})

bot.on('text', async (obj) => {
    obj = obj.update.message;
    let user = {
        nome: `${obj.from.first_name} + ${obj.from.last_name}`,
        chatId: obj.chat.id                
    }
    user = new User(user);
    if (userFromDb) {
        console.log('user already exists!');
        return;
    }
    await user.save();
    console.log('user saved!');
})

let state = {};

bot.command('lesgo', ctx => {
    const userId = ctx.message.from.id;

    if(!state[userId]) state[userId] = { id: userId};

    state[userId].command = 'lesgo';
    return ctx.replyWithMarkdown(`Lesgo! Para começar, me informe o seu usuario do gitlab`);
})

require('./startup/logging')();
require('./startup/database')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Api rodando na porta ${port}`));
bot.startPolling();

module.exports = server;

