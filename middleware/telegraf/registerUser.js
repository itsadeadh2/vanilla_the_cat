const winston = require('winston');
const { User } = require('../../models/user.model');

module.exports = async function (ctx, next) {
    const chatId = ctx.update.message.from.id;
    winston.info({ ctx: ctx });
    let userFromDb = await User.findOne({ chatId: chatId });
    if (userFromDb) {
        console.log('user already registered!');
    } else {
        let message = ctx.update.message;
        let user = {
            nome: `${message.from.first_name} ${message.from.last_name}`,
            chatId: message.chat.id
        }
        user = new User(user);
        await user.save();
        console.log('user saved!');
    }
    next();

}