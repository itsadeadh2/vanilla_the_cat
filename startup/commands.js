const { User } = require('../models/user.model');
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const winston = require('winston');
const { enter, leave } = Stage
const { Markup } = require('telegraf');



module.exports =  function(bot) {    
    const lesgoScene = new Scene('lesgo');
    lesgoScene.enter(async (ctx) => {
        const userId = ctx.message.from.id;

        let user = await User.findOne({chatId: userId});
        user.state = 'awaitingProjectId';

        await user.save();
        return ctx.replyWithMarkdown(`Lesgo! Para começar, me informe o id do seu projeto no gitlab`);
    })
    lesgoScene.on('text', async (ctx) => {
        const userId = ctx.message.from.id;

        return ctx.reply(
            `Apenas confirmando, o id do seu projeto é ${ctx.message.text} mesmo?`,
            Markup.inlineKeyboard([Markup.callbackButton('Sim, é o meu projeto', ctx.message.text), Markup.callbackButton('Acho que errei :/', 'null')]).extra()
        )

    })
    lesgoScene.on('callback_query', async (ctx) => {
        const userId = ctx.update.callback_query.from.id;
        const projectId = ctx.update.callback_query.data;
        ctx.answerCbQuery('Wait...');
        if (projectId=='null') return ctx.reply('Okay, entao me informe o ID do seu projeto novamente c:')        
        let user = await User.findOne({ chatId: userId });
        user.projectId = projectId;
        await user.save();
        ctx.replyWithMarkdown(`
        ***Ótimo***, estamos quase lá!
        Para terminar o processo de registro agora basta que voce [configure um webhook](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html) no GitLab utilizando a seguinte url http://51.79.87.65:3000/api/gitlabIntegration
        `)
        ctx.scene.leave();
    })

    const stage = new Stage([lesgoScene]);
    bot.use(stage.middleware());
    bot.command('lesgo', enter('lesgo'))
}