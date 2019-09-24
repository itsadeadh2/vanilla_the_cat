/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const moment = require('moment');
const winston = require('winston');
const { User } = require('../../models/user.model');
const { oauthService } = require('../../services/oauth.service');

module.exports = async function (ctx, next) {
  const user = await User.findById(ctx.from.id);
  if (!user || !user.refresh_token) return next();
  const diff = moment().diff(user.token_expires_in, 'seconds');
  if (diff >= 0) {
    try {
      const { access_token, refresh_token } = await oauthService.refreshToken(user.refresh_token);
      user.access_token = access_token;
      user.refresh_token = refresh_token;
      user.token_expires_in = moment().add(7200, 'minutes');
      winston.info('Token atualizado!');
      await user.save();
      return next();
    } catch (error) {
      winston.error(error);
    }
  }
  return next();
};
