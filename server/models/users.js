const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: {type: String, unique: true, required: true},
  accessToken: {type: String, required: true},
  displayName: {type: String}
})

const User = mongoose.model('User', userSchema);

module.exports = {User};