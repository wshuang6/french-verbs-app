const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { VerbGroup } = require('../models/verbGroup');

const router = express.Router();

router.use(jsonParser);

// Function for getting random items
function getRandomItem(getArr, total, verbs) {
  let randomNum = Math.floor(Math.random() * total);
  let item = getArr[randomNum];
  if (verbs.indexOf(item) > -1) {
    return getRandomItem(getArr, total, verbs);
  }
  else {
    return item;
  }
}

router.get('/:group', (req, res) => {
  const { group } = req.params;
  VerbGroup
    .find({group})
    .exec()
    .then(group => {
      // For now, only send back 10 random verbs from the queried group
      // This will be updated with the spaced repitition algorithm
      let verbs = [];
      const total = group[0].verbs.length;
      for (let i=0; i<10; i++) {
        let item = getRandomItem(group[0].verbs, total, verbs);
        verbs.push(item);
      }
      return res.status(200).json(verbs);
    });
});

// First we consult the user model for the given user to see if they 
// have any verbs they are stuggling with 
// We pull those verbs from our verbs data and insert them at the beginning of a queue
// We get the rest of the verbs randomly from the verbs data in the database.

router.put('/', (req, res) => {
  // Update the user model here based on the verb received and the result
  console.log(req.body);
  return res.status(200).json({message: 'received verb data. Will update user model'});
});

module.exports = {verbsRouter: router};