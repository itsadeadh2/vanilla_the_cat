const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.send({ name: 'Vanilla The Cat API', description: 'Vanilla the cat telegram bot api' }));

module.exports = router;
