/* eslint-disable func-names */
const express = require('express');
const webHookRoute = require('../routes/express/webhook.routes');
const oauthRoute = require('../routes/express/oauth.routes');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/gitlabIntegration', webHookRoute);
  app.use('/api/oauth', oauthRoute);
};
