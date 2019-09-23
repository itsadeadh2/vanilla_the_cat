const { User } = require('../models/user.model');
const Scene = require('telegraf/scenes/base')
const { Markup } = require('telegraf');
const oauthService = require('../services/oauth.service');


const lesgoScene = new Scene('lesgo');

lesgoScene.enter(async (ctx) => {
    const userId = ctx.from.id;
    let user = await User.findById(userId);
    if(user.token) return ctx.reply(
        `Gostaria de cadastrar um projeto agora?`,
        Markup.inlineKeyboard([Markup.callbackButton('Vamos lá!', 'yes'), Markup.callbackButton('Talvez mais tarde...', 'no')]).extra()
    )
    return ctx.replyWithMarkdown(`**Lesgo** 😺
    Para começar, me informe um **token de apenas leitura** do gitlab para que eu posa visualizar as informações de todos os seus projetos. Caso não saiba como fazer isso, [aqui esta uma pagina que fala um pouco sobre os tokens.](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)`);
})

lesgoScene.command('cancel', (ctx) => {
    ctx.reply('lesnotgo entao 😽')
    ctx.scene.leave();
})

lesgoScene.on('message', async (ctx) => {
    const userId = ctx.message.from.id;
    let user = await User.findById(userId);
    user.token = ctx.message.text;
    await user.save();
    return ctx.reply(
        `Muito bem! O seu token agora esta vinculado a ${ctx.message.from.username}. Gostaria de cadastrar um projeto agora?`,
        Markup.inlineKeyboard([Markup.callbackButton('Vamos lá!', 'yes'), Markup.callbackButton('Talvez mais tarde...', 'no')]).extra()
    )

})

lesgoScene.on('callback_query', async (ctx) => {
    const userId = ctx.update.callback_query.from.id;
    const answer = ctx.update.callback_query.data;
    ctx.answerCbQuery('Wait...');
    if (answer=='no') {
        ctx.replyWithMarkdown('Okay entao, qualquer coisa estou aqui!');
        ctx.scene.leave();
    }
    else {
        ctx.scene.leave();
        ctx.scene.enter('novoprojeto');
    }
})

module.exports = lesgoScene;