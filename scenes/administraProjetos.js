/* eslint-disable no-underscore-dangle */
const { Markup } = require('telegraf');
const Scene = require('telegraf/scenes/base');
const { User } = require('../models/user.model');

const administraProjScene = new Scene('administraProj');

administraProjScene.command('cancel', (ctx) => {
  ctx.reply('Okay, se precisar estou aqui!');
  ctx.scene.leave();
});

administraProjScene.enter(async (ctx) => {
  const userId = ctx.update.message.from.id;
  const user = await User.findById(userId);
  const projects = [];
  user.projects.forEach((project) => {
    projects.push(Markup.callbackButton(project.nome, project._id));
  });
  ctx.reply(
    'Selecione um projeto:',
    Markup.inlineKeyboard([projects]).extra(),
  );
});

administraProjScene.on('callback_query', async (ctx) => {
  const userId = ctx.from;
  let id;
  ctx.answerCbQuery('aguarde...');
  if (ctx.update.callback_query.data === 'delete') {
    const user = await User.findById(userId.id);
    const index = user.projects.indexOf((obj) => obj._id === id);
    user.projects.splice(index, 1);
    user.save();
    ctx.reply('Projeto excluído!');
    return ctx.scene.leave();
  }
  if (ctx.update.callback_query.data === 'cancel') {
    return ctx.scene.leave();
  }
  id = ctx.update.callback_query.data;
  return ctx.editMessageText(
    'O que deseja fazer?',
    Markup.inlineKeyboard([Markup.callbackButton('Excluir', 'delete'), Markup.callbackButton('Cancelar', 'cancel')]).extra(),
  );
});


module.exports = administraProjScene;
