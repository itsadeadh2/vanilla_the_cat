const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  projects: [
    { _id: String, nome: String },
  ],
  token: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
exports.User = User;
