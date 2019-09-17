const { User } = require('../models/user.model');
const Scene = require('telegraf/scenes/base')
const { Markup } = require('telegraf');
const axios = require('axios');
const winston = require('winston');

const novoProjetoScene = new Scene('novoprojeto');

let projeto = {};

novoProjetoScene.enter(async (ctx) => {
    return ctx.replyWithMarkdown(`Vamos lá! Para começar o cadastro do seu projeto, primeiramente me informe o ID do mesmo.`);
})

novoProjetoScene.on('text', async (ctx) => {
    projeto._id = ctx.message.text;
    let user = await User.findById(ctx.message.from.id);
    let projetoFromDb = user.projects.find(proj => {
        return proj._id == projeto._id;
    })
    if (projetoFromDb) return ctx.reply('O projeto já está cadastrado! Por favor, tente novamente.');
    let res = await axios.get('https://gitlab.com/api/v4/projects/'+projeto._id, { headers: { 'Private-Token': user.token } });
    projeto.nome = res.data.name;
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
    let user = await User.findById(userId);
    user.projects.push(projeto);
    await user.save();
    ctx.reply('Projeto cadastrado com sucesso!');
    ctx.scene.leave();
})

module.exports = novoProjetoScene;