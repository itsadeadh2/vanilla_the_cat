const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    projectId: {
        type: String
    },
    state: {
        type: String,
        enum: ['neutral', 'awaitingProjectId',]
    }
})

const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
exports.User = User;