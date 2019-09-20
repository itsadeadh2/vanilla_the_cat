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
                `Seu projeto <b>${req.body.project.name}</b> acabou de receber um <i>push</i> do ususario <b>${req.body.user_name}!</b>  Para mais detalhes <a href="${commit.url}">clique aqui</a>)`, { parse_mode: 'HTML' });
        });        
    } else if (req.body.object_kind == 'merge_request') {
        let projId = req.body.project.id;
        let users = await User.find({ 'projects._id': projId });
        users.forEach(user => {
            telegram.sendMessage(user._id,
                `Hey! O projeto <b>${req.body.project.name}</b> acabou de receber um <i>merge request</i> do usuário <b>${ req.body.user.name }!</b> Para mais detalhes <a href="${req.body.object_attributes.url}">clique aqui</a>`, { parse_mode: 'HTML' });        
        });
    }
}