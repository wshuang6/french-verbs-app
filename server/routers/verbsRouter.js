const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { VerbGroup } = require('../models/verbGroup');
const {User} = require('../models/users');
const router = express.Router();
const passport= require('passport');

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
    console.log(compareObject[item.fr])
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
// asdf

router.get('/:group', (req, res) => {
  let quizVerbs = [];
  let groupVerbs;
  const { group } = req.params;
  VerbGroup
    .find({group})
    .exec()
    .then(group => {
      // For now, only send back 10 random verbs from the queried group
      // This will be updated with the spaced repitition algorithm
      groupVerbs = group[0].verbs;
      return;
    })
    .then(stuff => {
      return User
        .findOne({googleId: req.user.googleId})
        .exec()
        .then(user => {
          let troll = user.troll[group];
          let trollArray = Object.keys(troll);
          // console.log('trollarr' +  trollArray)
          let dreadful = user.dreadful[group];
          let dreadfulArray = Object.keys(dreadful);
          // console.log('dreadarr' + dreadfulArray)
          if (trollArray.length > 0) {
            if (trollArray.length <= 3) {
              quizVerbs = trollArray;
            }
            else {
              for (i = 0; i < 3; i++) {
                shuffleLast(trollArray);
                quizVerbs.push(trollArray.pop())
              }
            }
          }
          let dreadfulCounter = 0;
          while (quizVerbs.length < 4 && dreadfulCounter < 3 && dreadfulArray.length > 0) {
            shuffleLast(dreadfulArray);
            quizVerbs.push(dreadfulArray.pop());
            dreadfulCounter++;
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
      let dreadful = user.dreadful;
      let troll = user.troll;
      let dreadfulNum = dreadful[verbCategory][verb];
      let trollNum = troll[verbCategory][verb];
      if (req.body.isCorrect) {
        if (dreadfulNum) {
          if (dreadfulNum > 1) {
            delete dreadful[verbCategory][verb];
          }
          else {
            dreadful[verbCategory][verb]++;
          }
        }
        else if (trollNum) {
          if (trollNum > 1) {
            delete troll[verbCategory][verb];
            dreadful[verbCategory][verb] = 1;
          }
          else {
            troll[verbCategory][verb]++;
          }
        }
        else return;
      }
      else {
        if (dreadfulNum) {
          delete dreadful[verbCategory][verb];
          troll[verbCategory][verb] = 1;
        }
        else if (trollNum) {
          troll[verbCategory][verb] = 1;
        }
        else {
          dreadful[verbCategory][verb] = 1;
        };
      }
      return User.findByIdAndUpdate(user._id, {$set: {dreadful, troll}}, {new: true})
    })
    .then(stuff => res.status(202))
});

module.exports = {verbsRouter: router};