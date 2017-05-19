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

//Function to find random item, move it to end of array
function shuffleLast (array) {
  let randomIndex = Math.floor(Math.random()*array.length)
  let temp = array[array.length - 1];
  array[array.length - 1] = array[randomIndex];
  array[randomIndex] = temp;
}

//Randomizes first four items as they may be struggle verbs
function shuffleFirstFour (array) {
  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random()*array.length)
    let temp = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = temp;
  }
}

//Getting past quiz scores
router.get('/score', (req, res) => {
  return User
    .findOne({googleId: req.user.googleId})
    .exec()
    .then(user => res.json(user.quizScores))
});

//Sending performance on current quiz
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

//Endpoint for getting 10 verbs, including verbs the user struggles with
router.get('/:group', (req, res) => {
  let quizVerbs = [];
  const { group } = req.params;
  VerbGroup
    .find({group})
    .exec()
    .then(group => {
      return group[0].verbs;
    })
    .then(groupVerbs => {
      return User
        .findOne({googleId: req.user.googleId})
        .exec()
        .then(user => {
          //Returns max 3 verbs from bigStruggle
          //Then returns max 3 verbs from littleStruggle, with max 4 verbs total from both sets
          let bigStruggleArray = Object.keys(user.bigStruggle[group]);
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
          //Tracks if word has already been inserted into quizVerbs
          let usedWords = {};
          //Replaces words with all necessary info for frontend
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
          return res.status(200).json(quizVerbs);
        })
      })     
});

// Update the user model here based on the verb received and the result
router.put('/', (req, res) => {
  let verb = req.body.verb.fr;
  let verbCategory = req.body.verbCategory;
  return User
    .findOne({googleId: req.user.googleId})
    .exec()
    .then(user => {
      //If verb not in either struggle, insert into littleStruggle with value 1
      //If verb in littleStruggle, and user got it wrong, demote to bigStruggle with value 1
      //If verb in littleStruggle, and user got it right, increment value 1
      //If verb in littleStruggle and num will reach 3, remove it from littleStruggle
      //If verb in bigStruggle, and user got it wrong, change value to 1
      //If verb in bigStruggle, and user got it right, increment value 1
      //If verb in bigStruggle, and num will reach 3, promote it to bigStruggle
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