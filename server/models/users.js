const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: {type: String, unique: true, required: true},
  accessToken: {type: String, required: true},
  displayName: {type: String}
  // Verbs they struggle with
  // Verbs they struggled with in the past but have answered correctly recently
})

const User = mongoose.model('User', userSchema);

module.exports = {User};