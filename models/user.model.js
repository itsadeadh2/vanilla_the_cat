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
  token_expires_in: {
    type: Date,
  },

  refresh_token: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = {
  userSchema,
  User
}
