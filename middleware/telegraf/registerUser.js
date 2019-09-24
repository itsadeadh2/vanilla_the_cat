const winston = require('winston');
const { User } = require('../../models/user.model');

module.exports = async (ctx, next) => {
  let userId;
  if (ctx.update.message) {
    userId = ctx.update.message.from.id;
  } else {
    userId = ctx.update.callback_query.from.id;
  }
  const userFromDb = await User.findById(userId);
  if (userFromDb) {
    winston.info('user already registered!');
  } else {
    const { message } = ctx.update;
    let user = {
      nome: `${message.from.first_name} ${message.from.last_name}`,
      _id: message.chat.id,
    };
    user = new User(user);
    await user.save();
    winston.info('user saved!');
  }
  next();
};
