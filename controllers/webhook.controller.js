const winston = require('winston');
const webhookService = require('../services/webhook.service');

exports.post = async (req, res, next) => {
    const { body } = req
    await webhookService.process({ strategy: body.object_kind, data: body });
    winston.info(body);
    res.status(200).json(body);
}