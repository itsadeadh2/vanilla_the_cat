/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const winston = require('winston');
const Scene = require('telegraf/scenes/base');
const { Markup } = require('telegraf');
const axios = require('axios');
const { User } = require('../models/user.model');
const { projectsService } = require('../services/projects.service');

const novoProjetoScene = new Scene('novoprojeto');

let projects = [];

function getNextTwo(startIndex, array) {
  let values = [];
  if ((startIndex + 2) <= array.length) {
    let index = 0;
    for (index = startIndex; index < startIndex + 2; index++) {
      values.push(array[index]);
    }
    values.push(Markup.callbackButton('Ver Mais', JSON.stringify({ index, value: 'ver mais', isRepo: false })));
  } else {
    values = [
      Markup.callbackButton('Voltar ao Inicio', JSON.stringify({ value: 'voltar ao inicio', isRepo: false })),
      Markup.callbackButton('Cancelar', JSON.stringify({ value: 'cancelar', isRepo: false })),
    ];
  }
  return values;
}

const setwebHook = async function (projectId, token) {
  const hookUrl = 'http://www.itsadeadh2.com/api/gitlabIntegration';
  let alreadyRegistered = false;

  const res = await axios.get(`https://gitlab.com/api/v4/projects/${projectId}/hooks`, { headers: { Authorization: `Bearer ${token}` } });
  alreadyRegistered = res.data.some((hook) => hook.url === hookUrl);

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

novoProjetoScene.enter(async (ctx) => {
  const user = await User.findById(ctx.from.id);
  projects = await projectsService.getProjectsByUserId(user._id);
  projects = projects.map((project) => (Markup.callbackButton(
    project.name,
    JSON.stringify({ value: project.id, isRepo: true }),
  )));
  return ctx.reply(
    'Selecione um projeto:',
    Markup.inlineKeyboard([getNextTwo(0, projects)]).extra(),
  );
});


novoProjetoScene.on('callback_query', async (ctx) => {
  const answer = JSON.parse(ctx.update.callback_query.data);
  const userId = ctx.update.callback_query.from.id;
  ctx.answerCbQuery('Wait...');
  if (!answer.isRepo) {
    if (answer.value === 'ver mais') {
      return ctx.editMessageText(
        'Selecione um projeto',
        Markup.inlineKeyboard([getNextTwo(answer.index, projects)]).extra(),
      );
    }
    if (answer.value === 'voltar ao inicio') {
      return ctx.editMessageText(
        'Selecione um projeto',
        Markup.inlineKeyboard([getNextTwo(0, projects)]).extra(),
      );
    }
    if (answer.value === 'cancelar') {
      ctx.reply('Deixemos para outra hora entao c:');
      return ctx.scene.leave();
    }

    if (answer.value === 'confirm') {
      const { id, name } = await projectsService.getProjectById(userId, answer.projectId);
      const user = await User.findById(userId);
      await setwebHook(id, user.token);
      const project = { _id: id, nome: name };
      user.projects.push(project);
      await user.save();
      ctx.reply('Projeto cadastrado com sucesso!');
      return ctx.scene.leave();
    }
  }
  const project = await projectsService.getProjectById(userId, answer.value);
  return ctx.editMessageText(
    `Apenas confirmando, o projeto em questão é o ${project.name} ${project.web_url}?`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Sim, é este projeto', JSON.stringify({ value: 'confirm', projectId: project.id })),
      Markup.callbackButton('Não é este projeto', JSON.stringify({ value: 'voltar ao inicio' })),
    ]).extra(),
  );
});

module.exports = novoProjetoScene;
