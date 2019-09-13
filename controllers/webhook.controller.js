const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const config = require('config');
const telegram = new Telegram(config.get('token'));
const bot = new Telegraf(config.get('token'));
const winston = require('winston');
const { User } = require('../models/user.model');
exports.post = async (req, res, next) => {
    // winston.info(req.body);
    if(req.body.object_kind != 'pipeline')
        return res.status(400).send({message: 'sorry, vanilla cant handle these requests :c'})
    let projId = req.body.project.id;
    let users = await User.find({ projectId: projId });
    users.forEach(user => {
        telegram.sendMessage(user.chatId, `Hey! Your project ${req.body.project.name} is currently: ${req.body.object_attributes.status} a ${req.body.object_kind} of the commit ${req.body.commit.message} (${req.body.commit.id})`);
    });
    winston.info(req.body);
    res.send(req.body);
}