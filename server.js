const config = require('config');
const express = require('express');
const winston = require('winston');
const Telegraf = require('telegraf/telegraf');

const bot = new Telegraf(config.get('token'));
const app = express();

require('./startup/logging')();
require('./startup/database')();
require('./startup/routes')(app);
require('./startup/telegram')(bot);
require('./startup/scenes')(bot);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Api rodando na porta ${port}`));


module.exports = server;

