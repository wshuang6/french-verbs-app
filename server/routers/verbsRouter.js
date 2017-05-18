const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { VerbGroup } = require('../models/verbGroup');
const {User} = require('../models/users');
const router = express.Router();

router.use(jsonParser);

// Function for getting random items
function getRandomItem(getArr, total, compareObject) {
  let randomNum = Math.floor(Math.random() * total);
  let item = getArr[randomNum];
  if (compareObject[item.fr]) {
    return getRandomItem(getArr, total, compareObject);
  }
  else {
    compareObject[item.fr] = true;
    return item;
  }
}

function shuffleLast (array) {
  let randomIndex = Math.floor(Math.random()*array.length)
  let temp = array[array.length - 1];
  array[array.length - 1] = array[randomIndex];
  array[randomIndex] = temp;
}

function shuffleFirstFour (array) {
  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random()*array.length)
    let temp = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = temp;
  }
}

router.get('/score', (req, res) => {
  return User
    .findOne({googleId: req.user.googleId})
    .exec()
    .then(user => res.json(user.quizScores))
});

router.put('/score', (req, res) => {
  return User
    .findOne({googleId: req.user.googleId})
    .exec()
    .then(user => {
      let quizScores = user.quizScores;
      quizScores.push(req.body);
      return User.findByIdAndUpdate(user._id, {$set: {quizScores}}, {new: true});
    })
    .then(() => res.status(200).json());
});

router.get('/:group', (req, res) => {
  let quizVerbs = [];
  const { group } = req.params;
  VerbGroup
    .find({group})
    .exec()
    .then(group => {
      // For now, only send back 10 random verbs from the queried group
      // This will be updated with the spaced repitition algorithm
      // groupVerbs = group[0].verbs;
      return group[0].verbs;
    })
    .then(groupVerbs => {
      return User
        .findOne({googleId: req.user.googleId})
        .exec()
        .then(user => {
          // let bigStruggle = user.bigStruggle[group];
          let bigStruggleArray = Object.keys(user.bigStruggle[group]);
          // let littleStruggle = user.littleStruggle[group];
          let littleStruggleArray = Object.keys(user.littleStruggle[group]);
          if (bigStruggleArray.length > 0) {
            if (bigStruggleArray.length <= 3) {
              quizVerbs = bigStruggleArray;
            }
            else {
              for (i = 0; i < 3; i++) {
                shuffleLast(bigStruggleArray);
                quizVerbs.push(bigStruggleArray.pop());
              }
            }
          }
          let littleStruggleCounter = 0;
          while (quizVerbs.length < 4 && littleStruggleCounter < 3 && littleStruggleArray.length > 0) {
            shuffleLast(littleStruggleArray);
            quizVerbs.push(littleStruggleArray.pop());
            littleStruggleCounter++;
          }
          let usedWords = {};
          // console.log('quizverbs' + quizVerbs)
          quizVerbs = quizVerbs.map(word => {
            let item;
            for (i = 0; i < groupVerbs.length && (item === undefined); i++) {
              if (groupVerbs[i].fr === word) {
                item = groupVerbs[i];
                usedWords[word] = true;
              }
            }
            return item;
          })
          while (quizVerbs.length < 10) {
            let item = getRandomItem(groupVerbs, groupVerbs.length, usedWords);
            quizVerbs.push(item);
          }
          shuffleFirstFour(quizVerbs);
          // console.log(quizVerbs)
          return res.status(200).json(quizVerbs);
        })
      })     
});

// First we consult the user model for the given user to see if they 
// have any verbs they are stuggling with 
// We pull those verbs from our verbs data and insert them at the beginning of a queue
// We get the rest of the verbs randomly from the verbs data in the database.

router.put('/', (req, res) => {
  // Update the user model here based on the verb received and the result
  let verb = req.body.verb.fr;
  let verbCategory = req.body.verbCategory;
  return User
    .findOne({googleId: req.user.googleId})
    .exec()
    .then(user => {
      let littleStruggle = user.littleStruggle;
      let bigStruggle = user.bigStruggle;
      let littleStruggleNum = littleStruggle[verbCategory][verb];
      let bigStruggleNum = bigStruggle[verbCategory][verb];
      if (req.body.isCorrect) {
        if (littleStruggleNum) {
          if (littleStruggleNum > 1) {
            delete littleStruggle[verbCategory][verb];
          }
          else {
            littleStruggle[verbCategory][verb]++;
          }
        }
        else if (bigStruggleNum) {
          if (bigStruggleNum > 1) {
            delete bigStruggle[verbCategory][verb];
            littleStruggle[verbCategory][verb] = 1;
          }
          else {
            bigStruggle[verbCategory][verb]++;
          }
        }
        else return;
      }
      else {
        if (littleStruggleNum) {
          delete littleStruggle[verbCategory][verb];
          bigStruggle[verbCategory][verb] = 1;
        }
        else if (bigStruggleNum) {
          bigStruggle[verbCategory][verb] = 1;
        }
        else {
          littleStruggle[verbCategory][verb] = 1;
        };
      }

      return User.findByIdAndUpdate(user._id, {$set: {littleStruggle, bigStruggle}}, {new: true})
    })
    .then(() => res.status(202).json())
});

module.exports = {verbsRouter: router};