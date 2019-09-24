const express = require('express');

const router = express.Router();
const controller = require('../../controllers/oauth.controller');

router.get('/', controller.process);

module.exports = router;
