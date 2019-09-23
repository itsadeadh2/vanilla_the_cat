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
    let url = await oauthService.generateUserUrl(user._id);
    ctx.reply(`**Lesgo** 😺
    Utilize o seguinte link para se autenticar ao GitLab: ${url}`);
    ctx.reply('Após autorizar o acesso volte aqui e use /lesgo novamente c:');
    return ctx.scene.leave();
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