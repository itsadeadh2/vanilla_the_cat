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
    projects: [
        {id: String, nome: String}
    ],
    token: {
        type: String
    }
})

const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
exports.User = User;