/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const config = require('config');
const axios = require('axios');
const winston = require('winston');
const { User } = require('../models/user.model');

exports.oauthService = {
  client_secret: process.env.CLIENT_SECRET,
  client_id: process.env.CLIENT_ID,
  redirectUri: 'http://45.79.228.17:3000/api/oauth',
  baseUrl: 'https://gitlab.com/oauth',

  generateStateHash(user) {
    return jwt.sign({ _id: user._id, nome: user.nome }, config.get('jwtPrivateKey'));
  },

  async generateUserUrl(userId) {
    const user = await User.findById(userId);
    const token = this.generateStateHash(user);
    const url = `${this.baseUrl}/authorize?client_id=${this.client_id}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&state=${token}&scope=api+read_repository+read_user+write_repository+read_registry+sudo`;
    return url;
  },

  async validateToken(token) {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const user = await User.findById(decoded._id);
    if (!user) return false;
    return user._id;
  },

  async getUserToken(code) {
    try {
      const url = 'https://gitlab.com/oauth/token';
      const res = await axios.post(url, null, {
        params: {
          client_id: this.client_id,
          client_secret: this.client_secret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        },
      });
      return res.data;
    } catch (err) {
      return winston.info(err);
    }
  },

  async process(token, code) {
    const userId = await this.validateToken(token);
    if (!userId) return false;
    const { access_token } = await this.getUserToken(code);
    const user = await User.findById(userId);
    user.token = access_token;
    await user.save();
    return user;
  },
};
