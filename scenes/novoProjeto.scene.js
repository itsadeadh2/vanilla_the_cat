const { User } = require('../models/user.model');
const Scene = require('telegraf/scenes/base')
const { Markup } = require('telegraf');
const axios = require('axios');
const winston = require('winston');

const novoProjetoScene = new Scene('novoprojeto');

let projetoId;

novoProjetoScene.enter(async (ctx) => {
    return ctx.replyWithMarkdown(`Vamos lá! Para começar o cadastro do seu projeto, primeiramente me informe o ID do mesmo.`);
})

novoProjetoScene.on('text', async (ctx) => {
    projetoId = ctx.message.text;
    let user = await User.findOne({chatId: ctx.message.from.id})
    let res = await axios.get('https://gitlab.com/api/v4/projects/'+projetoId, { headers: { 'Private-Token': user.token } });
    winston.info(res);
    return ctx.reply(
        `Apenas confirmando, o projeto em questao é o ${res.data.name}?`,
        Markup.inlineKeyboard([Markup.callbackButton('Sim, é este projeto', 'yes'), Markup.callbackButton('Não, não é este', 'no')]).extra()
    )
})

novoProjetoScene.on('callback_query', async (ctx) => {
    const answer = ctx.update.callback_query.data;
    const userId = ctx.update.callback_query.from.id;

    ctx.answerCbQuery('Wait...');

    if(answer=='no') return ctx.replyWithMarkdown('Okay! Envie o Id do projeto que deseja cadastrar.');
    let user = await User.findOne({chatId: userId});
    user.projectId = projetoId;
    await user.save();
    ctx.reply('Projeto cadastrado com sucesso!');
    ctx.scene.leave();
})

module.exports = novoProjetoScene;