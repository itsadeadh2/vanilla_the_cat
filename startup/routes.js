const express = require('express');
const route = require('../routes/index');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/gitlabIntegration', route);
}