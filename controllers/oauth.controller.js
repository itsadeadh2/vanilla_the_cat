const winston = require('winston');
const oauthService = require('../services/oauth.service');

const oauthController = {
    async process(req, res) {
        let { code, state } = req.params;
        winston.info({ code, state });
    }
}