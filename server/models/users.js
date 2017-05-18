const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  googleId: {type: String, unique: true, required: true},
  accessToken: {type: String, required: true},
  displayName: {type: String},
  troll: {
    er: {type: Schema.Types.Mixed, default: {}}, 
    ir: {type: Schema.Types.Mixed, default: {}},
    re: {type: Schema.Types.Mixed, default: {}},
    irregular: {type: Schema.Types.Mixed, default: {}},
  },
  dreadful: {
    er: {type: Schema.Types.Mixed, default: {}}, 
    ir: {type: Schema.Types.Mixed, default: {}},
    re: {type: Schema.Types.Mixed, default: {}},
    irregular: {type: Schema.Types.Mixed, default: {}},
  },
  quizScores: [{date: Date, right: Number, wrong: Number, quizType: String, verbGroup: String}]
}, {minimize: false})

const User = mongoose.model('User', userSchema);

module.exports = {User};