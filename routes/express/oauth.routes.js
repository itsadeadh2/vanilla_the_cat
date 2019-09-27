const express = require('express');

const router = express.Router();
const oauthController = require('../../controllers/oauth.controller');

router.get('/', oauthController.process);

module.exports = router;
