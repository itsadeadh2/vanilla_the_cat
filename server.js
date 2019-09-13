const express = require('express');
const winston = require('winston');
const app = express();

const registerUser = require('./middleware/telegraf/registerUser');

const config = require('config');
const Telegraf = require('telegraf/telegraf');
const bot = new Telegraf(config.get('token'));

bot.use(registerUser);

let state = {};

require('./startup/logging')();
require('./startup/database')();
require('./startup/routes')(app);
require('./startup/commands')(bot);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Api rodando na porta ${port}`));
bot.startPolling();

module.exports = server;

