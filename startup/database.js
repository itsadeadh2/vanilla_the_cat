const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = () => {
  const db = config.get('db');
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => winston.info(`Connected to ${db} ...`));
};
