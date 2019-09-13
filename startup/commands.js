module.exports = function(bot) {
    let state = [];
    bot.command('lesgo', ctx => {
        const userId = ctx.message.from.id;

        if(!state[userId]) state[userId] = { id: userId};

        state[userId].command = 'lesgo';
        return ctx.replyWithMarkdown(`Lesgo! Para começar, me informe o seu usuario do gitlab`);
        
    })
}