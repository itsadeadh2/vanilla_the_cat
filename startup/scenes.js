const Stage = require('telegraf/stage')
const { enter, leave } = Stage
const lesgoScene = require('../scenes/lesgo.scene');
const novoProjetoScene = require('../scenes/novoProjeto.scene');
const administraProjScene = require('../scenes/administraProjetos');

module.exports =  function(bot) {       
    const stage = new Stage([lesgoScene, novoProjetoScene, administraProjScene]);
    bot.use(stage.middleware());
    bot.command('lesgo', enter('lesgo'))
    bot.command('projetos', enter('administraProj'))
    bot.command('novoprojeto', enter('novoprojeto'))
}