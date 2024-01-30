// backend/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  password: String,
  file: String,
  verified: Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
