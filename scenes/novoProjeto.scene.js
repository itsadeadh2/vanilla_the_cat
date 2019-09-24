/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const winston = require('winston');
const Scene = require('telegraf/scenes/base');
const { Markup } = require('telegraf');
const axios = require('axios');
const { User } = require('../models/user.model');

const novoProjetoScene = new Scene('novoprojeto');

const projeto = {};

const setwebHook = async function (projectId, token) {
  const hookUrl = 'http://45.79.228.17:3000/api/gitlabIntegration';
  let alreadyRegistered = false;

  const res = await axios.get(`https://gitlab.com/api/v4/projects/${projectId}/hooks`, { headers: { Authorization: `Bearer ${token}` } });
  alreadyRegistered = res.data.some(hook => hook.url === hookUrl);

  if (!alreadyRegistered) {
    try {
      await axios.post(`https://gitlab.com/api/v4/projects/${projectId}/hooks`, {
        id: projectId,
        url: hookUrl,
        push_events: true,
        issues_events: true,
        merge_requests_events: true,
        tag_push_events: true,
        note_events: true,
        job_events: true,
        pipeline_events: true,
        wiki_page_events: true,
        enable_ssl_verification: false,
        confidential_issues_events: true,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      winston.info(error);
    }
  }
};

novoProjetoScene.command('cancel', (ctx) => {
  ctx.reply('Okay, se precisar estou aqui!');
  ctx.scene.leave();
});

novoProjetoScene.enter(async (ctx) => ctx.replyWithMarkdown('Vamos lá! Para começar o cadastro do seu projeto, primeiramente me informe o ID do mesmo.'));

novoProjetoScene.on('text', async (ctx) => {
  projeto._id = ctx.message.text;
  const user = await User.findById(ctx.message.from.id);
  const projetoFromDb = user.projects.find((proj) => proj._id === projeto._id);
  if (projetoFromDb) return ctx.reply('O projeto já está cadastrado! Por favor, tente novamente.');
  try {
    const res = await axios.get(`https://gitlab.com/api/v4/projects/${projeto._id}`, { headers: { Authorization: `Bearer ${user.token}` } });
    projeto.nome = res.data.name;
    return ctx.reply(
      `Apenas confirmando, o projeto em questao é o ${res.data.name}?`,
      Markup.inlineKeyboard([Markup.callbackButton('Sim, é este projeto', 'yes'), Markup.callbackButton('Não, não é este', 'no')]).extra(),
    );
  } catch (error) {
    console.log(error);
    return ctx.scene.leave();
  }
});

novoProjetoScene.on('callback_query', async (ctx) => {
  const answer = ctx.update.callback_query.data;
  const userId = ctx.update.callback_query.from.id;

  ctx.answerCbQuery('Wait...');

  if (answer === 'no') return ctx.replyWithMarkdown('Okay! Envie o Id do projeto que deseja cadastrar.');
  const user = await User.findById(userId);
  user.projects.push(projeto);
  setwebHook(projeto._id, user.token);
  await user.save();
  ctx.reply('Projeto cadastrado com sucesso!');
  return ctx.scene.leave();
});

module.exports = novoProjetoScene;
