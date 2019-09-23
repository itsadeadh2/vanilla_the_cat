const { User } = require('../models/user.model');
const Scene = require('telegraf/scenes/base')
const { Markup } = require('telegraf');
const axios = require('axios');
const winston = require('winston');

const administraProjScene = new Scene('administraProj');

let projectId;

administraProjScene.command('cancel', (ctx) => {
    ctx.reply('Okay, se precisar estou aqui!');
    ctx.scene.leave();
})

administraProjScene.enter(async (ctx) => {
    let userId = ctx.update.message.from.id;
    let user = await User.findById(userId);
    let projects = [];
    user.projects.forEach(project => {
        projects.push( Markup.callbackButton(project.nome, project._id));           
    })
    ctx.reply(
        'Selecione um projeto:',
        Markup.inlineKeyboard([projects]).extra()
    )
});

administraProjScene.on('callback_query', async (ctx) => {
    const projectId = ctx.update.callback_query;
    const userId = ctx.from;
    ctx.answerCbQuery('aguarde...');
    if (ctx.update.callback_query.data == 'delete'){
        let user = await User.findById(userId.id);
        let index = user.projects.indexOf((obj) => obj._id == id);
        user.projects.splice(index, 1);
        user.save();
        ctx.reply('Projeto excluído!');
        return ctx.scene.leave();
    }
    if (ctx.update.callback_query.data == 'cancel'){
        return ctx.scene.leave();
    }
    id = ctx.update.callback_query.data;
    ctx.editMessageText(
        'O que deseja fazer?',
        Markup.inlineKeyboard([Markup.callbackButton('Excluir', 'delete'), Markup.callbackButton('Cancelar', 'cancel')]).extra()
    )
})

administraProjScene.on('text', async (ctx) => {

})


module.exports = administraProjScene;