const Telegram = require('telegraf/telegram');
const config = require('config');
const telegram = new Telegram(process.env.TOKEN);
const winston = require('winston');
const { User } = require('../models/user.model');

exports.post = async (req, res, next) => {    
    if(req.body.object_kind == 'pipeline'){
        let projId = req.body.project.id;
        let users = await User.find({ 'projects._id': projId });
        users.forEach(user => {
            telegram.sendMessage(user._id, 'Hey! O seu projeto '+ req.body.project.name + ' está executando uma ' + req.body.object_kind + ' do commit ```' + req.body.commit.message + '``` no estado: ```'  + req.body.object_attributes.status + '```', { parse_mode: 'Markdown' });
        });
        winston.info(req.body);
        res.send(req.body);
    } else if (req.body.object_kind == 'push'){
        let projId = req.body.project.id;
        let users = await User.find({ 'projects._id': projId });
        commit = req.body.commits.find(commit => {
            return commit.id === req.body.checkout_sha;
        });
        users.forEach(user => {
            telegram.sendMessage(user._id,
                `Seu projeto *${req.body.project.name}* acabou de receber um _push_ do ususario *${req.body.user_name}!*  Para mais detalhes [clique aqui](${commit.url})`, { parse_mode: 'Markdown' });
        })        
    }
}