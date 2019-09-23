const telegram = require('../clients/telegram.client');
const { User } = require('../models/user.model');

const webhookService = {
    async getUsersByProjectId(projectId) {
        const users = await User.find({ 'projects._id': projectId });
        return users;
    },

    async process({ strategy, data }) {
        const strategyMap = new Map([
            ['pipeline', this.pipeline],
            ['push', this.push],
            ['merge_request', this.mergeRequest]
        ])
        const strategyFn = strategyMap.get(strategy);
        await strategyFn({ data });
    },

    async pipeline({ data }) {
        const { commit, project, object_attributes, object_kind } = data;
        const users = await this.getUsersByProjectId(project.id);
        users.forEach(user => {
            const msg = `Hey! O seu projeto ${project.name} está executando uma ${object_kind} do commit \`\`\`${commit.message}\`\`\` no estado: \`\`\`${object_attributes.status}\`\`\``;
            telegram.sendMessage(user._id, msg, { parse_mode: 'Markdown' })
        })
    },

    async push({ data }) {
        const { commits, project, user_name, checkout_sha } = data;
        const users = await this.getUsersByProjectId(project.id);
        commit = commits.find(commit => commit.id === checkout_sha);
        users.forEach(user => {
            const msg = `Seu projeto <b>${req.body.project.name}</b> acabou de receber um <i>push</i> do ususario <b>${req.body.user_name}!</b>  Para mais detalhes <a href="${commit.url}">clique aqui</a>)`;
            telegram.sendMessage(user._id, msg, { parse_mode: 'HTML' });
        });
    },

    async mergeRequest({ data }) {
        const { project, object_attributes } = data;
        const users = await this.getUsersByProjectId(project.id);
        users.forEach(user => {
            const msg = `Hey! O projeto <b>${req.body.project.name}</b> acabou de receber um <i>merge request</i> do usuário <b>${ req.body.user.name }!</b> Para mais detalhes <a href="${req.body.object_attributes.url}">clique aqui</a>`;
            telegram.sendMessage(user._id, msg, { parse_mode: 'HTML' });
        });
    }
}

module.exports = webhookService;