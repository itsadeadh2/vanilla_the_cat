const winston = require('winston');
const { webhookService } = require('../services/webhook.service');

const webhookController = {
  async notify(req, res) {
    const { body } = req;
    await webhookService.process({ strategy: body.object_kind, data: body });
    winston.info(body);
    res.status(200).json(body);
  },
};

module.exports = webhookController;
