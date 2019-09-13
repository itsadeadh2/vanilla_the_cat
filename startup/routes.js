const express = require('express');
const route = require('../routes/express/webhook.routes');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/gitlabIntegration', route);
}