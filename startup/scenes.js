const Stage = require('telegraf/stage')
const { enter, leave } = Stage
const lesgoScene = require('../scenes/lesgo.scene');
const novoProjetoScene = require('../scenes/novoProjeto.scene');

module.exports =  function(bot) {       
    const stage = new Stage([lesgoScene, novoProjetoScene]);
    bot.use(stage.middleware());
    bot.command('lesgo', enter('lesgo'))
}