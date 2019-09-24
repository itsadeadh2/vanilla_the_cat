const winston = require('winston');
const { oauthService } = require('../services/oauth.service');

const oauthController = {
  async process(req, res) {
    const { code, state } = req.query;
    const user = await oauthService.process(state, code);
    if (!user) return res.status(400).send('Ops! parece que há algo de errado com seu token. Tente novamente.');
    winston.info(user);
    return res.send('Pronto, agora voce está autenticado no GitLab!');
  },
};

module.exports = oauthController;
