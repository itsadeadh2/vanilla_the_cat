/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const telegram = require('../clients/telegram.client');
const { User } = require('../models/user.model');

async function getUsersByProjectId(projectId) {
  const users = await User.find({ 'projects._id': projectId });
  return users;
}

exports.webhookService = {

  async process({ strategy, data }) {
    const strategyMap = new Map([
      ['pipeline', this.pipeline],
      ['push', this.push],
      ['merge_request', this.mergeRequest],
      ['issue', this.issue],
      ['note', this.note],
    ]);
    const strategyFn = strategyMap.get(strategy);
    await strategyFn({ data });
  },

  async issue({ data }) {
    const {
      user,
      project,
      labels,
      object_attributes,
    } = data;

    const users = await getUsersByProjectId(project.id);
    users.forEach((usr) => {
      const msg = `Hey! O seu projeto <b>${project.name}</b> tem uma issue no estado <i>${object_attributes.state}</i> criada pelo usuario <b>${user.name}</b>!`;
      telegram.sendMessage(usr._id, msg, { parse_mode: 'HTML' });
    });
  },

  async pipeline({ data }) {
    const {
      commit,
      project,
      object_attributes,
      object_kind,
    } = data;
    const users = await getUsersByProjectId(project.id);
    users.forEach((user) => {
      const msg = `Hey! O seu projeto <b>${project.name}</b> está executando uma <i>${object_kind}</i> do commit <b>${commit.message}</b> no estado: <i>${object_attributes.status}</i>`;
      telegram.sendMessage(user._id, msg, { parse_mode: 'HTML' });
    });
  },

  async push({ data }) {
    const {
      commits,
      project,
      user_name,
      checkout_sha,
    } = data;
    const users = await getUsersByProjectId(project.id);
    const commit = commits.find((cmt) => cmt.id === checkout_sha);
    users.forEach((user) => {
      const msg = `Seu projeto <b>${project.name}</b> acabou de receber um <i>push</i> do ususario <b>${user_name}!</b>  Para mais detalhes <a href="${commit.url}">clique aqui</a>)`;
      telegram.sendMessage(user._id, msg, { parse_mode: 'HTML' });
    });
  },

  async mergeRequest({ data }) {
    const { project, object_attributes } = data;
    const users = await this.getUsersByProjectId(project.id);
    users.forEach((user) => {
      const msg = `Hey! O projeto <b>${project.name}</b> acabou de receber um <i>merge request</i> do usuário <b>${user.name}!</b> Para mais detalhes <a href="${object_attributes.url}">clique aqui</a>`;
      telegram.sendMessage(user._id, msg, { parse_mode: 'HTML' });
    });
  },

  async note({ data }) {
    const { project, object_attributes, user } = data;
    const users = await getUsersByProjectId(project.id);
    users.forEach((sub) => {
      const msg = `Hey! O usuario <b>${user.name}</b> acabou de postar um comentário no <i>${object_attributes.noteable_type}</i> do projeto ${project.name}: <i>"${object_attributes.note}"</i> <a href="${object_attributes.url}">Ver na web</a>`;
      telegram.sendMessage(sub._id, msg, { parse_mode: 'HTML' });
    });
  },
};
